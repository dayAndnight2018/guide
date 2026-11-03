#!/usr/bin/env node
// 安装/卸载 Native Messaging Host
//   安装: node native-host/install.js
//   卸载: node native-host/install.js --uninstall
//
// 安装做两件事：
//   1. 生成 native-host/host-manifest.json（含本机绝对路径 + 扩展 ID 白名单）
//   2. 写入注册表（HKCU，无需管理员）：
//        Chrome: HKCU\Software\Google\Chrome\NativeMessagingHosts\com.dayandnight.guide
//        Edge:   HKCU\Software\Microsoft\Edge\NativeMessagingHosts\com.dayandnight.guide
//
// 扩展 ID 从 extension/manifest.json 的 key 字段推导（与 gen-key.js 生成的保持一致）

'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const HOST_NAME = 'com.dayandnight.guide';
const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(__dirname, 'host-manifest.json');
const REG_KEYS = [
    'HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\' + HOST_NAME,
    'HKCU\\Software\\Microsoft\\Edge\\NativeMessagingHosts\\' + HOST_NAME,
];

function extensionId() {
    const extManifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'extension', 'manifest.json'), 'utf8'));
    if (!extManifest.key) throw new Error('extension/manifest.json 缺少 key 字段，请先运行 node native-host/gen-key.js');
    const der = Buffer.from(extManifest.key, 'base64');
    const hash = crypto.createHash('sha256').update(der).digest();
    let id = '';
    for (let i = 0; i < 16; i++) {
        id += String.fromCharCode(97 + (hash[i] >> 4));
        id += String.fromCharCode(97 + (hash[i] & 0xf));
    }
    return id;
}

function reg(args) {
    const r = spawnSync('reg', args, { encoding: 'utf8', windowsHide: true });
    if (r.status !== 0) throw new Error('reg ' + args.join(' ') + ' 失败: ' + (r.stderr || '').trim());
    return r;
}

const uninstall = process.argv.includes('--uninstall');

if (uninstall) {
    for (const k of REG_KEYS) {
        try {
            reg(['delete', k, '/f']);
            console.log('已删除注册表项:', k);
        } catch (e) {
            console.log('跳过（不存在或失败）:', k);
        }
    }
    if (fs.existsSync(MANIFEST_PATH)) {
        fs.unlinkSync(MANIFEST_PATH);
        console.log('已删除:', MANIFEST_PATH);
    }
    console.log('卸载完成。');
    process.exit(0);
}

const extId = extensionId();
const hostManifest = {
    name: HOST_NAME,
    description: 'Guide 导航站本地管理宿主（读写 js/data.js，执行 git 提交推送）',
    path: path.join(__dirname, 'host.bat'),
    type: 'stdio',
    allowed_origins: ['chrome-extension://' + extId + '/'],
};
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(hostManifest, null, 4), 'utf8');
console.log('已生成:', MANIFEST_PATH);
console.log('  扩展 ID:', extId);

for (const k of REG_KEYS) {
    reg(['add', k, '/ve', '/t', 'REG_SZ', '/d', MANIFEST_PATH, '/f']);
    console.log('已注册:', k);
}

console.log('');
console.log('安装完成。接下来：');
console.log('  1. 打开 chrome://extensions（Edge 为 edge://extensions）');
console.log('  2. 开启「开发者模式」->「加载已解压的扩展程序」，选择目录: ' + path.join(ROOT, 'extension'));
console.log('  3. 工具栏出现 Guide 图标即可使用');
