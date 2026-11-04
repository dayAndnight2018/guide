#!/usr/bin/env node
// 宿主脚本端到端测试（不依赖浏览器）
//   1. 解析->再生成->再解析 的数据完整性（用真实 data.js，只读）
//   2. get/save/再get 的增删改流程（在临时目录的仓库副本上执行，不动真实文件）
//   3. gitStatus（对真实仓库只读执行）
// 运行：node native-host/test-host.js

'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const HOST = path.join(__dirname, 'host.js');
const REAL_DATA = path.join(__dirname, '..', 'js', 'data.js');
let failures = 0;

function assert(cond, name) {
    if (cond) {
        console.log('  PASS', name);
    } else {
        failures++;
        console.error('  FAIL', name);
    }
}

// 与宿主相同的帧协议
function makeHost(env) {
    const child = spawn(process.execPath, [HOST], {
        env: Object.assign({}, process.env, env),
        stdio: ['pipe', 'pipe', 'inherit'],
    });
    let buf = Buffer.alloc(0);
    const waiting = [];
    child.stdout.on('data', (chunk) => {
        buf = Buffer.concat([buf, chunk]);
        while (buf.length >= 4) {
            const len = buf.readUInt32LE(0);
            if (buf.length < 4 + len) break;
            const msg = JSON.parse(buf.slice(4, 4 + len).toString('utf8'));
            buf = buf.slice(4 + len);
            const cb = waiting.shift();
            if (cb) cb(msg);
        }
    });
    return {
        send(msg) {
            return new Promise((resolve) => {
                waiting.push(resolve);
                const body = Buffer.from(JSON.stringify(msg), 'utf8');
                const head = Buffer.alloc(4);
                head.writeUInt32LE(body.length, 0);
                child.stdin.write(Buffer.concat([head, body]));
            });
        },
        close() {
            child.stdin.end();
            child.kill();
        },
    };
}

const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

async function main() {
    // ---------- 测试 1：再生成不丢数据（只读真实文件） ----------
    console.log('[1] 数据再生成完整性（真实 data.js，只读）');
    // 直接复用宿主里的生成函数：用 require 会执行主循环，改为读源码 eval 提取
    const src = fs.readFileSync(HOST, 'utf8');
    const vm = require('vm');
    const sandbox = { require, module: { exports: {} }, process: { env: {} }, __dirname };
    sandbox.global = sandbox;
    // 只执行到协议部分之前：截取 "Native Messaging 协议" 注释之前的代码
    const head = src.split('// ---------------- Native Messaging').shift();
    vm.runInNewContext(head + '\n;module.exports={parseDataFile,generateDataFile};', sandbox);
    const { parseDataFile, generateDataFile } = sandbox.module.exports;

    const parsed1 = parseDataFile();
    const regenerated = generateDataFile(parsed1.tabs, parsed1.groups);
    // 再生成的文本必须仍是合法 JS 且能解析回相同结构
    fs.writeFileSync(path.join(os.tmpdir(), 'guide-regen-check.js'), regenerated, 'utf8');
    const parsed2 = (() => {
        const fn = new Function(regenerated + ';return {guideTabListData, guideTabGroupListData};');
        return fn();
    })();
    assert(deepEqual(parsed1.tabs, parsed2.guideTabListData), 'tabs 再生成后结构一致');
    assert(deepEqual(parsed1.groups, parsed2.guideTabGroupListData), 'groups 再生成后结构一致');
    assert(parsed1.tabs.length === 11, '分类数=11（当前实际值）');
    const totalItems = parsed1.groups.reduce((n, g) => n + g.data.length, 0);
    console.log('  信息: 共', totalItems, '个导航地址');

    // ---------- 测试 2：临时仓库副本上的 get/save 流程 ----------
    console.log('[2] get / save / get 流程（临时目录副本）');
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'guide-host-test-'));
    fs.mkdirSync(path.join(tmp, 'js'), { recursive: true });
    fs.copyFileSync(REAL_DATA, path.join(tmp, 'js', 'data.js'));

    const h = makeHost({ GUIDE_REPO_ROOT: tmp });

    const r1 = await h.send({ cmd: 'get' });
    assert(r1.ok === true && Array.isArray(r1.tabs) && Array.isArray(r1.groups), 'get 返回数据');
    assert(r1.groups.length === 11, 'get 分组数=11');

    // 模拟：改一个、删一个、加一个
    const tabs = r1.tabs, groups = r1.groups;
    groups[10].data[0].alt = '免费模型排行(已改)';
    const removed = groups[10].data.splice(1, 1)[0];
    groups[10].data.push({ src: 'https://example.com/new', alt: '新地址测试' });

    const r2 = await h.send({ cmd: 'save', tabs, groups });
    assert(r2.ok === true, 'save 成功');
    assert(fs.existsSync(path.join(tmp, 'js', 'data.js.bak')), '保存前生成备份 data.js.bak');

    const r3 = await h.send({ cmd: 'get' });
    const g10 = r3.groups[10].data;
    assert(g10.some((x) => x.alt === '免费模型排行(已改)'), '修改后的标题已写入');
    assert(!g10.some((x) => x.src === removed.src), '删除的地址已移除');
    assert(g10.some((x) => x.src === 'https://example.com/new'), '新增的地址已写入');

    // 坏数据保护：save 传非法结构应报错且不破坏文件
    const r4 = await h.send({ cmd: 'save', tabs: 'not-array', groups });
    assert(r4.ok === false && /tabs\/groups/.test(r4.error), '非法 save 参数被拒绝');

    h.close();

    // ---------- 测试 3：gitStatus（真实仓库，只读） ----------
    console.log('[3] gitStatus（真实仓库，只读）');
    const h2 = makeHost({});
    const r5 = await h2.send({ cmd: 'gitStatus' });
    assert(r5.ok === true && typeof r5.dirty === 'number', 'gitStatus 返回 dirty 计数');
    console.log('  信息: 当前仓库未提交文件数 =', r5.dirty);
    h2.close();

    // ---------- 测试 4：commitPush 完整流程（本地裸仓库，离线） ----------
    console.log('[4] commitPush 流程（临时本地裸仓库，不联网）');
    const work = fs.mkdtempSync(path.join(os.tmpdir(), 'guide-git-test-'));
    const bare = work + '-bare.git';
    fs.mkdirSync(path.join(work, 'js'), { recursive: true });
    fs.copyFileSync(REAL_DATA, path.join(work, 'js', 'data.js'));
    const wg = (args) => spawnSync('git', ['-C', work].concat(args), { encoding: 'utf8' });
    spawnSync('git', ['init', '-b', 'master', work], { encoding: 'utf8' });
    wg(['config', 'user.email', 'test@test.local']);
    wg(['config', 'user.name', 'test']);
    spawnSync('git', ['init', '--bare', '-b', 'master', bare], { encoding: 'utf8' });
    wg(['remote', 'add', 'origin', bare]);
    wg(['add', '-A']);
    wg(['commit', '-m', 'init']);
    wg(['push', '-u', 'origin', 'master']);
    const countBare = () => parseInt(spawnSync('git', ['-C', bare, 'rev-list', '--count', 'master'], { encoding: 'utf8' }).stdout.trim(), 10);

    const h3 = makeHost({ GUIDE_REPO_ROOT: work });
    const g0 = await h3.send({ cmd: 'get' });
    g0.groups[0].data.push({ src: 'https://example.com/git-test', alt: 'git流程测试' });
    await h3.send({ cmd: 'save', tabs: g0.tabs, groups: g0.groups });
    const r6 = await h3.send({ cmd: 'commitPush', message: '测试提交' });
    assert(r6.ok === true && !r6.nothing, 'commitPush 提交并推送成功');
    assert(countBare() === 2, '裸仓库收到新提交（1 -> 2）');
    const r7 = await h3.send({ cmd: 'commitPush' });
    assert(r7.ok === true && r7.nothing === true, '无更改且无未推提交时返回 nothing');
    h3.close();

    // ---------- 测试 5：真实仓库无副作用路径 ----------
    console.log('[5] commitPush 真实仓库（仅在干净时验证 nothing 路径）');
    if (r5.dirty === 0) {
        const h4 = makeHost({});
        const r8 = await h4.send({ cmd: 'commitPush' });
        assert(r8.ok === true && r8.nothing === true, '真实仓库干净时返回 nothing（不产生副作用）');
        h4.close();
    } else {
        console.log('  跳过: 当前仓库有未提交文件（', r5.dirty, '个），不在此测试中提交真实仓库');
    }

    // 清理临时目录
    for (const f of ['js/data.js', 'js/data.js.bak']) {
        const p = path.join(tmp, f);
        if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    fs.rmdirSync(path.join(tmp, 'js'));
    fs.rmdirSync(tmp);
    fs.rmSync(work, { recursive: true, force: true });
    fs.rmSync(bare, { recursive: true, force: true });

    console.log('');
    if (failures === 0) {
        console.log('全部测试通过 ✓');
    } else {
        console.error(failures, '项测试失败 ✗');
        process.exit(1);
    }
}

main().catch((e) => {
    console.error('测试脚本异常:', e);
    process.exit(1);
});
