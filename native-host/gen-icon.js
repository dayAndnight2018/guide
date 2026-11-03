// 一次性工具：生成扩展图标（PNG，零依赖，Node 自带 zlib）
// 罗盘造型：圆角深蓝底 + 白色指针 + 橙色中心点
// 运行：node native-host/gen-icon.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SIZE = 128;
const OUT = path.resolve(__dirname, '..', 'extension', 'icons', 'icon.png');

// ---------- PNG 编码 ----------
const CRC_TABLE = (() => {
    const t = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        t[n] = c;
    }
    return t;
})();
function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
}

// ---------- 像素绘制 ----------
const px = new Uint8Array(SIZE * SIZE * 4); // RGBA

function inRoundedRect(x, y, x0, y0, x1, y1, r) {
    if (x < x0 || x > x1 || y < y0 || y > y1) return false;
    const cx = Math.max(x0 + r, Math.min(x, x1 - r));
    const cy = Math.max(y0 + r, Math.min(y, y1 - r));
    return (x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r;
}
// 抗锯齿覆盖度（1px 软边）
function coverage(x, y, fn) {
    let hit = 0;
    for (const [dx, dy, w] of [[0.25, 0.25, 0.25], [0.75, 0.25, 0.25], [0.25, 0.75, 0.25], [0.75, 0.75, 0.25]]) {
        if (fn(x + dx, y + dy)) hit += w;
    }
    return hit;
}

const BG = [37, 54, 91];      // 深蓝
const NEEDLE_N = [255, 94, 68]; // 北针-珊瑚红
const NEEDLE_S = [240, 244, 255]; // 南针-近白
const DOT = [255, 176, 32];   // 中心点-橙
const C = SIZE / 2;

// 指针（菱形两半）：北半 x 轴窄三角 + 南半
const halfW = 13, len = 44;
const inNorth = (x, y) => {
    const dx = Math.abs(x - C), dy = C - y;              // dy>=0 向上
    return dy >= 0 && dy <= len && dx <= halfW * (1 - dy / len);
};
const inSouth = (x, y) => {
    const dx = Math.abs(x - C), dy = y - C;              // dy>=0 向下
    return dy >= 0 && dy <= len && dx <= halfW * (1 - dy / len);
};

for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
        const i = (y * SIZE + x) * 4;
        let color = BG, a = coverage(x, y, (sx, sy) => inRoundedRect(sx, sy, 6, 6, SIZE - 7, SIZE - 7, 26));
        // 背景纵向微渐变
        color = [BG[0] + Math.round(18 * y / SIZE), BG[1] + Math.round(22 * y / SIZE), BG[2] + Math.round(30 * y / SIZE)];
        // 指针
        const an = coverage(x, y, inNorth), as = coverage(x, y, inSouth);
        if (an > 0) { color = NEEDLE_N; a = Math.max(a, an); }
        else if (as > 0) { color = NEEDLE_S; a = Math.max(a, as); }
        // 中心圆点
        const ad = coverage(x, y, (sx, sy) => (sx - C) * (sx - C) + (sy - C) * (sy - C) <= 10 * 10);
        if (ad > 0) { color = DOT; a = Math.max(a, ad); }
        px[i] = color[0]; px[i + 1] = color[1]; px[i + 2] = color[2]; px[i + 3] = Math.round(a * 255);
    }
}

// ---------- 组装 PNG ----------
const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
for (let y = 0; y < SIZE; y++) {
    raw[y * (SIZE * 4 + 1)] = 0; // filter: none
    Buffer.from(px.buffer, y * SIZE * 4, SIZE * 4).copy(raw, y * (SIZE * 4 + 1) + 1);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 6;  // RGBA
const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
]);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, png);
console.log('已生成图标:', OUT, png.length, 'bytes');
