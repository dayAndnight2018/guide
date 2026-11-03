#!/usr/bin/env node
// Guide 导航插件本地宿主（Chrome/Edge Native Messaging Host）
//
// 职责：
//   1. 解析/再生成 js/data.js（唯一数据源，桌面端与移动端页面共用）
//   2. 执行 git 提交与推送
// 通信协议：Chrome Native Messaging（4 字节小端长度前缀 + JSON），每条消息独立处理（无状态）
//
// 命令：
//   {cmd: "get"}                                  -> {ok, tabs, groups}
//   {cmd: "save", tabs, groups}                   -> {ok}（先备份 data.js.bak）
//   {cmd: "gitStatus"}                            -> {ok, dirty, lines}
//   {cmd: "commitPush", message}                  -> {ok, nothing?, commit?, push?}
//
// 环境变量 GUIDE_REPO_ROOT 可覆盖仓库根目录（测试用）

'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(process.env.GUIDE_REPO_ROOT || path.resolve(__dirname, '..'));
const DATA_FILE = path.join(REPO_ROOT, 'js', 'data.js');
const BACKUP_FILE = DATA_FILE + '.bak';

// ---------------- data.js 解析与生成 ----------------

function parseDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        throw new Error('找不到数据文件: ' + DATA_FILE);
    }
    const text = fs.readFileSync(DATA_FILE, 'utf8');
    // data.js 是普通脚本，声明了两个全局变量；在函数作用域内执行并取回
    const grab = new Function(
        text + '\n;' +
        'return {' +
        ' guideTabListData: (typeof guideTabListData !== "undefined" ? guideTabListData : null),' +
        ' guideTabGroupListData: (typeof guideTabGroupListData !== "undefined" ? guideTabGroupListData : null)' +
        '};'
    )();
    const tabs = grab.guideTabListData;
    const groups = grab.guideTabGroupListData;
    if (!Array.isArray(tabs) || !Array.isArray(groups)) {
        throw new Error('data.js 结构不符合预期（缺少 guideTabListData / guideTabGroupListData）');
    }
    // 基本校验：分类有 title/num；分组有 num/data，且每个地址有 src/alt
    for (const t of tabs) {
        if (t == null || typeof t.title !== 'string' || typeof t.num !== 'number') {
            throw new Error('分类数据不合法: ' + JSON.stringify(t));
        }
    }
    for (const g of groups) {
        if (g == null || typeof g.num !== 'number' || !Array.isArray(g.data)) {
            throw new Error('分组数据不合法: ' + JSON.stringify(g));
        }
        for (const it of g.data) {
            if (it == null || typeof it.src !== 'string' || typeof it.alt !== 'string') {
                throw new Error('地址数据不合法: ' + JSON.stringify(it));
            }
        }
    }
    return { tabs, groups };
}

// 生成可读、diff 友好的 data.js（每个地址占一行）
function generateDataFile(tabs, groups) {
    const lines = [];
    lines.push('// 导航数据（唯一数据源）');
    lines.push('// 本文件由 Guide 浏览器插件自动再生成；手动修改同样有效，插件每次操作前都会重新读取');
    lines.push('');
    lines.push('let guideTabListData = [');
    for (const t of tabs) lines.push('\t' + JSON.stringify(t) + ',');
    lines.push('];');
    lines.push('');
    lines.push('let guideTabGroupListData = [');
    for (const g of groups) {
        lines.push('\t{');
        lines.push('\t\tnum: ' + JSON.stringify(g.num) + ',');
        lines.push('\t\tdata: [');
        for (const it of g.data) lines.push('\t\t\t' + JSON.stringify(it) + ',');
        lines.push('\t\t]');
        lines.push('\t},');
    }
    lines.push('];');
    return lines.join('\n') + '\n';
}

// ---------------- git ----------------

function git(args, timeoutMs) {
    const r = spawnSync('git', ['-C', REPO_ROOT].concat(args), {
        encoding: 'utf8',
        timeout: timeoutMs || 30000,
        windowsHide: true,
    });
    if (r.error) throw new Error('无法执行 git: ' + r.error.message);
    return {
        code: r.status,
        stdout: (r.stdout || '').trim(),
        stderr: (r.stderr || '').trim(),
    };
}

function gitStatus() {
    const r = git(['status', '--porcelain']);
    if (r.code !== 0) throw new Error('git status 失败: ' + r.stderr);
    const lines = r.stdout ? r.stdout.split('\n') : [];
    return { dirty: lines.length, lines };
}

function commitPush(message) {
    const status = gitStatus();
    if (status.dirty === 0) {
        return { ok: true, nothing: true };
    }
    // 需要一个合理的提交说明
    const msg = (message && String(message).trim()) || '更新导航';
    let r = git(['add', '-A']);
    if (r.code !== 0) throw new Error('git add 失败: ' + r.stderr);
    r = git(['commit', '-m', msg]);
    if (r.code !== 0) throw new Error('git commit 失败: ' + r.stderr);
    const commitOut = r.stdout;
    // 推送给凭据弹窗留足时间
    r = git(['push'], 180000);
    if (r.code !== 0) {
        throw new Error('提交成功但推送失败（可稍后在插件中重试或手动 push）:\n' + (r.stderr || r.stdout));
    }
    return { ok: true, commit: commitOut, push: r.stdout || r.stderr || '完成' };
}

// ---------------- Native Messaging 协议 ----------------

function send(obj) {
    const body = Buffer.from(JSON.stringify(obj), 'utf8');
    const head = Buffer.alloc(4);
    head.writeUInt32LE(body.length, 0);
    process.stdout.write(Buffer.concat([head, body]));
}

function handleMessage(msg) {
    switch (msg && msg.cmd) {
        case 'get':
            return Object.assign({ ok: true }, parseDataFile(), { repoRoot: REPO_ROOT });
        case 'save':
            if (!Array.isArray(msg.tabs) || !Array.isArray(msg.groups)) {
                throw new Error('save 命令缺少 tabs/groups');
            }
            parseDataFile(); // 确认当前文件可解析，顺便防止把坏文件覆盖掉备份
            if (fs.existsSync(DATA_FILE)) fs.copyFileSync(DATA_FILE, BACKUP_FILE);
            fs.writeFileSync(DATA_FILE, generateDataFile(msg.tabs, msg.groups), 'utf8');
            return { ok: true };
        case 'gitStatus':
            return Object.assign({ ok: true }, gitStatus());
        case 'commitPush':
            return commitPush(msg.message);
        default:
            throw new Error('未知命令: ' + JSON.stringify(msg && msg.cmd));
    }
}

// 主循环：读 stdin 的帧消息，逐条处理后回写
let buf = Buffer.alloc(0);
process.stdin.on('data', (chunk) => {
    buf = Buffer.concat([buf, chunk]);
    while (buf.length >= 4) {
        const len = buf.readUInt32LE(0);
        if (buf.length < 4 + len) break;
        const raw = buf.slice(4, 4 + len).toString('utf8');
        buf = buf.slice(4 + len);
        let resp;
        try {
            resp = handleMessage(JSON.parse(raw));
        } catch (e) {
            resp = { ok: false, error: e && e.message ? e.message : String(e) };
        }
        send(resp);
    }
});
process.stdin.on('end', () => process.exit(0));
process.stdin.on('error', () => process.exit(0));
