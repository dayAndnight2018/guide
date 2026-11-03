// 一次性工具：生成扩展密钥并固定扩展 ID
// 扩展 ID 由公钥 SHA-256 派生（映射到 a-p），写入 manifest.json 的 key 字段后 ID 永久固定，
// 这样本地宿主的白名单(allowed_origins)可以提前写死，安装后无需再手动查 ID。
// 运行：node native-host/gen-key.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const extDir = path.resolve(__dirname, '..', 'extension');
const pemPath = path.join(extDir, 'key.pem');

if (!fs.existsSync(pemPath)) {
    const { privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
        publicKeyEncoding: { type: 'spki', format: 'pem' },
    });
    fs.mkdirSync(extDir, { recursive: true });
    fs.writeFileSync(pemPath, privateKey);
    console.log('已生成新密钥: extension/key.pem（请勿提交到仓库）');
} else {
    console.log('沿用已有密钥: extension/key.pem');
}

const der = crypto.createPublicKey(fs.readFileSync(pemPath)).export({ type: 'spki', format: 'der' });
const hash = crypto.createHash('sha256').update(der).digest();

// 扩展 ID：SHA-256 前 16 字节，每个半字节映射为 a-p
let id = '';
for (let i = 0; i < 16; i++) {
    id += String.fromCharCode(97 + (hash[i] >> 4));
    id += String.fromCharCode(97 + (hash[i] & 0xf));
}

console.log('扩展 ID   :', id);
console.log('key 字段  :');
console.log(der.toString('base64'));
