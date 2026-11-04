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
        env: Object.assign({}, process.env, {
            // 禁止 git 在终端里等用户输入账号密码（凭据走 GCM，避免后台静默挂死）
            GIT_TERMINAL_PROMPT: '0',
        }),
    });
    if (r.error) throw new Error('无法执行 git: ' + r.error.message);
    return {
        code: r.status,
        signal: r.signal || '',
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

// 把 git 失败结果整理成可读文本（保证非空）
function describeGitFailure(r) {
    const parts = [];
    if (r.stdout) parts.push(r.stdout);
    if (r.stderr) parts.push(r.stderr);
    if (r.signal) parts.push('进程被终止(' + r.signal + ')，通常是超时');
    if (!parts.length) parts.push('git 退出码 ' + r.code + '（无输出）');
    return parts.join('\n');
}

function commitPush(message) {
    const status = gitStatus();
    // 未推送的提交也算“有待处理”（上次推送失败后可直接重试推送）
    const ahead = git(['rev-list', '--count', 'origin/master..HEAD']);
    const nAhead = ahead.code === 0 ? (parseInt(ahead.stdout, 10) || 0) : 0;
    if (status.dirty === 0 && nAhead === 0) {
        return { ok: true, nothing: true };
    }

    let commitOut = '';
    if (status.dirty > 0) {
        const msg = (message && String(message).trim()) || '更新导航';
        let r = git(['add', '-A']);
        if (r.code !== 0) throw new Error('git add 失败: ' + describeGitFailure(r));
        r = git(['commit', '-m', msg]);
        if (r.code !== 0) throw new Error('git commit 失败: ' + describeGitFailure(r));
        commitOut = r.stdout;
    }

    // 推送：github 网络间歇性抖动时自动重试；凭据类错误不重试
    let lastErr = '';
    for (let attempt = 1; attempt <= 3; attempt++) {
        const r = git(['push'], 180000); // 给凭据弹窗（GCM 首次授权）留足时间
        if (r.code === 0) {
            return { ok: true, commit: commitOut, push: r.stdout || r.stderr || '完成' };
        }
        lastErr = describeGitFailure(r);
        if (/terminal prompts disabled|Authentication failed|could not read Username|403/i.test(lastErr)) break;
        if (attempt < 3) {
            // 同步等待 3 秒后重试
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 3000);
        }
    }
    throw new Error('提交已保留在本地，仅推送失败（网络恢复后再点一次即可）:\n' + lastErr);
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
