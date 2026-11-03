// Guide 导航管理 - popup 逻辑
// 数据流：popup（本地编辑） -> 本地宿主(save: 重写 js/data.js) -> (可选) git 提交推送
'use strict';

const HOST = 'com.dayandnight.guide';

const state = {
    tabs: [],            // [{title, num}]
    groups: [],          // [{num, data: [{src, alt}]}]
    activeNum: null,     // 当前分类
    editKey: null,       // 正在编辑的条目 "num:index"
    confirmDelKey: null, // 待确认删除
    showAdd: false,      // 添加表单（含预填）
    addPrefill: { alt: '', src: '' },
    newCatOpen: false,   // 新建分类输入框
    filter: '',
    diff: { add: 0, del: 0, mod: 0 },
    gitDirty: null,
    repoRoot: '',
    currentTab: null,    // 浏览器当前页 {url, title}
    busy: false,
};

const $ = (id) => document.getElementById(id);

// ---------------- 与本地宿主通信 ----------------

function sendNative(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendNativeMessage(HOST, message, (resp) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            if (!resp) { reject(new Error('本地宿主无响应')); return; }
            if (resp.ok === false) { reject(new Error(resp.error || '未知错误')); return; }
            resolve(resp);
        });
    });
}

function hostDownHint(err) {
    $('banner').textContent =
        '无法连接本地宿主：' + err.message +
        '\n请确认已运行 node native-host/install.js 且已重启浏览器。';
    $('banner').classList.remove('hidden');
}

// ---------------- 工具 ----------------

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

function domainOf(url) {
    try { return new URL(url).hostname; } catch (e) { return url; }
}

function colorOf(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return 'hsl(' + (h % 360) + ', 48%, 44%)';
}

const totalItems = () => state.groups.reduce((n, g) => n + g.data.length, 0);

function normalizeUrl(u) {
    u = (u || '').trim();
    if (!u) return '';
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    try { new URL(u); return u; } catch (e) { return ''; }
}

function autoMsg() {
    const d = state.diff;
    const parts = [];
    if (d.add) parts.push('+' + d.add);
    if (d.del) parts.push('-' + d.del);
    if (d.mod) parts.push('~' + d.mod);
    return '更新导航 ' + (parts.join(' ') || '');
}

function markDiff(kind) {
    state.diff[kind]++;
    $('hint').innerHTML = '<span class="dirty">● ' + state.diff.add + ' 增 ' +
        state.diff.del + ' 删 ' + state.diff.mod + ' 改 未保存</span>';
    $('btnSave').disabled = false;
}

// ---------------- 渲染 ----------------

function renderChips() {
    const el = $('chips');
    let html = state.tabs.map((t) => {
        const cnt = (state.groups.find((g) => g.num === t.num) || { data: [] }).data.length;
        return '<div class="chip' + (t.num === state.activeNum ? ' active' : '') + '" data-action="chip" data-num="' + t.num + '">' +
            esc(t.title) + '<span class="cnt">' + cnt + '</span></div>';
    }).join('');
    if (state.newCatOpen) {
        html += '<div class="newcat"><input id="newCatName" placeholder="新分类名称">' +
            '<button class="btn small" data-action="newcat-ok">建</button>' +
            '<button class="btn small" data-action="newcat-cancel">✕</button></div>';
    } else {
        html += '<div class="chip plus" data-action="newcat">＋</div>';
    }
    el.innerHTML = html;
    if (state.newCatOpen) {
        const inp = $('newCatName');
        inp.focus();
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') doNewCat();
            if (e.key === 'Escape') { state.newCatOpen = false; renderChips(); }
        });
    }
}

function renderList() {
    const el = $('list');
    const group = state.groups.find((g) => g.num === state.activeNum);
    if (!group) { el.innerHTML = '<div class="empty">请选择分类</div>'; return; }

    let items = group.data;
    const kw = state.filter.trim().toLowerCase();
    if (kw) items = items.filter((it) => it.alt.toLowerCase().includes(kw) || it.src.toLowerCase().includes(kw));

    if (!items.length) {
        el.innerHTML = '<div class="empty">' + (kw ? '无匹配结果' : '该分类暂无地址') + '</div>';
        return;
    }

    el.innerHTML = items.map((it) => {
        const idx = group.data.indexOf(it);
        const key = group.num + ':' + idx;
        const dom = domainOf(it.src);

        if (state.editKey === key) {
            // 编辑表单（替换整行）
            const opts = state.tabs.map((t) =>
                '<option value="' + t.num + '"' + (t.num === group.num ? ' selected' : '') + '>' + esc(t.title) + '</option>').join('');
            return '<div class="form" data-key="' + key + '">' +
                '<div class="row"><div style="flex:1"><label>名称</label><input id="editAlt" value="' + esc(it.alt) + '"></div></div>' +
                '<div class="row"><div style="flex:1"><label>地址</label><input id="editSrc" value="' + esc(it.src) + '"></div></div>' +
                '<div class="row"><div style="flex:1"><label>分类</label><select id="editNum">' + opts + '</select></div></div>' +
                '<div class="btns"><button class="btn" data-action="edit-cancel">取消</button>' +
                '<button class="btn primary" data-action="edit-ok">保存修改</button></div>' +
                '</div>';
        }

        const ops = state.confirmDelKey === key
            ? '<button class="op danger-text" data-action="del-ok" data-num="' + group.num + '" data-idx="' + idx + '">确认删除?</button>' +
              '<button class="op" data-action="del-cancel">✕</button>'
            : '<button class="op" title="修改" data-action="edit" data-num="' + group.num + '" data-idx="' + idx + '">✏️</button>' +
              '<button class="op del" title="删除" data-action="del" data-num="' + group.num + '" data-idx="' + idx + '">🗑️</button>';

        return '<div class="item">' +
            '<div class="avatar" style="background:' + colorOf(dom) + '">' + esc((it.alt.trim()[0] || '?').toUpperCase()) + '</div>' +
            '<div class="info" data-action="open" data-src="' + esc(it.src) + '">' +
            '<div class="name">' + esc(it.alt) + '</div>' +
            '<div class="url">' + esc(dom) + '</div></div>' +
            '<div class="ops">' + ops + '</div>' +
            '</div>';
    }).join('');
}

function renderAddForm() {
    const old = $('addForm');
    if (old) old.remove();
    if (!state.showAdd) return;
    const div = document.createElement('div');
    div.className = 'form';
    div.id = 'addForm';
    const opts = state.tabs.map((t) =>
        '<option value="' + t.num + '"' + (t.num === state.activeNum ? ' selected' : '') + '>' + esc(t.title) + '</option>').join('');
    div.innerHTML =
        '<div class="row"><div style="flex:2"><label>名称</label><input id="addAlt" placeholder="站点名称" value="' + esc(state.addPrefill.alt) + '"></div>' +
        '<div style="flex:1"><label>分类</label><select id="addNum">' + opts + '</select></div></div>' +
        '<div class="row"><div style="flex:1"><label>地址</label><input id="addSrc" placeholder="https://…" value="' + esc(state.addPrefill.src) + '"></div></div>' +
        '<div class="row"><div class="hintline" id="addHint" style="flex:1"></div>' +
        '<div class="btns" style="align-items:center"><button class="btn" data-action="add-cancel">取消</button>' +
        '<button class="btn primary" data-action="add-ok">添加</button></div></div>';
    $('list').parentNode.insertBefore(div, $('list'));
    $('addAlt').focus();
}

function renderStat() {
    const parts = [totalItems() + ' 个地址'];
    if (state.gitDirty === null) parts.push('…');
    else if (state.gitDirty === 0) parts.push('仓库干净');
    else parts.push('<span class="warn">' + state.gitDirty + ' 个文件未提交</span>');
    $('stat').innerHTML = parts.join(' · ');
}

function render() {
    renderChips();
    renderAddForm();
    renderList();
    renderStat();
}

// ---------------- 操作 ----------------

function doNewCat() {
    const name = ($('newCatName').value || '').trim();
    if (!name) return;
    let max = -1;
    for (const t of state.tabs) max = Math.max(max, t.num);
    const num = max + 1;
    state.tabs.push({ title: name, num });
    state.groups.push({ num, data: [] });
    state.activeNum = num;
    state.newCatOpen = false;
    markDiff('mod');
    render();
}

function doAdd() {
    const alt = ($('addAlt').value || '').trim();
    const src = normalizeUrl($('addSrc').value);
    if (!alt) { $('addHint').textContent = '请填写名称'; return; }
    if (!src) { $('addHint').textContent = '地址不合法（需 http/https）'; return; }
    const num = Number($('addNum').value);
    const group = state.groups.find((g) => g.num === num);
    if (!group) return;
    if (group.data.some((it) => it.src === src)) {
        $('addHint').textContent = '该分类下已存在此地址';
        return;
    }
    group.data.push({ src, alt });
    state.showAdd = false;
    state.activeNum = num;
    state.filter = '';
    $('filter').value = '';
    markDiff('add');
    render();
    toast('已添加（未保存到文件）', 'ok');
}

function doEditOk(groupNum, idx) {
    const alt = ($('editAlt').value || '').trim();
    const src = normalizeUrl($('editSrc').value);
    if (!alt || !src) { alert2('名称与地址不能为空'); return; }
    const target = Number($('editNum').value);
    const group = state.groups.find((g) => g.num === groupNum);
    const item = group.data[idx];
    const changed = item.alt !== alt || item.src !== src || target !== groupNum;
    if (!changed) { state.editKey = null; renderList(); return; }

    if (target === groupNum) {
        item.alt = alt; item.src = src;
    } else {
        group.data.splice(idx, 1);
        state.groups.find((g) => g.num === target).data.push({ src, alt });
        state.activeNum = target;
    }
    state.editKey = null;
    markDiff('mod');
    render();
}

function doDel(groupNum, idx) {
    const group = state.groups.find((g) => g.num === groupNum);
    const item = group.data[idx];
    if (!item) return; // 确认动作由两步按钮（“确认删除?”）承担，MV3 弹窗中 window.confirm 会被忽略
    group.data.splice(idx, 1);
    state.confirmDelKey = null;
    markDiff('del');
    render();
}

async function saveToHost() {
    await sendNative({ cmd: 'save', tabs: state.tabs, groups: state.groups });
    state.diff = { add: 0, del: 0, mod: 0 };
    $('hint').textContent = '';
}

async function refreshGit() {
    const r = await sendNative({ cmd: 'gitStatus' });
    state.gitDirty = r.dirty;
    renderStat();
}

async function onSave(push) {
    if (state.busy) return;
    const hasLocalEdits = state.diff.add || state.diff.del || state.diff.mod;
    if (!push && !hasLocalEdits) { toast('没有需要保存的更改'); return; }
    if (push && !hasLocalEdits && state.gitDirty === 0) { toast('没有需要提交的更改'); return; }

    state.busy = true;
    const btn = push ? $('btnPush') : $('btnSave');
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = push ? '推送中…' : '保存中…';
    try {
        if (hasLocalEdits) await saveToHost();
        if (push) {
            const msg = ($('msg').value || '').trim() || autoMsg();
            const r = await sendNative({ cmd: 'commitPush', message: msg });
            if (r.nothing) toast('没有需要提交的更改');
            else {
                const first = (r.commit || '').split('\n')[0];
                toast('已提交并推送 ✓\n' + first, 'ok');
                $('msg').value = '';
            }
        } else {
            toast('已保存到 data.js（未提交）', 'ok');
        }
        await refreshGit();
    } catch (e) {
        toast(push ? '失败：' + e.message : '保存失败：' + e.message, 'err');
        hostDownHint(e);
    }
    state.busy = false;
    btn.disabled = false;
    btn.textContent = label;
}

// ---------------- 交互绑定 ----------------

function toast(text, kind) {
    const t = $('toast');
    t.textContent = text;
    t.className = 'toast ' + (kind || '');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.className = 'toast hidden'; }, kind === 'err' ? 6000 : 2600);
}

function alert2(msg) { toast(msg, 'err'); }

document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const act = target.dataset.action;

    switch (act) {
        case 'chip':
            state.activeNum = Number(target.dataset.num);
            state.editKey = null;
            state.confirmDelKey = null;
            state.showAdd = false;
            render();
            break;
        case 'newcat':
            state.newCatOpen = true; renderChips(); break;
        case 'newcat-ok': doNewCat(); break;
        case 'newcat-cancel': state.newCatOpen = false; renderChips(); break;
        case 'add-open':
            state.showAdd = true;
            state.addPrefill = {
                alt: (state.currentTab && state.currentTab.title || '').trim().slice(0, 40),
                src: state.currentTab && state.currentTab.url || '',
            };
            render();
            break;
        case 'add-ok': doAdd(); break;
        case 'add-cancel': state.showAdd = false; renderAddForm(); break;
        case 'edit':
            state.editKey = target.dataset.num + ':' + target.dataset.idx;
            state.confirmDelKey = null;
            renderList();
            break;
        case 'edit-ok': doEditOk(Number(target.closest('.form').dataset.key.split(':')[0]),
            Number(target.closest('.form').dataset.key.split(':')[1])); break;
        case 'edit-cancel': state.editKey = null; renderList(); break;
        case 'del':
            state.confirmDelKey = target.dataset.num + ':' + target.dataset.idx;
            renderList();
            break;
        case 'del-ok': doDel(Number(target.dataset.num), Number(target.dataset.idx)); break;
        case 'del-cancel': state.confirmDelKey = null; renderList(); break;
        case 'open':
            chrome.tabs.create({ url: target.dataset.src });
            window.close();
            break;
    }
});

$('btnAdd').addEventListener('click', () => {
    state.showAdd = true;
    state.addPrefill = {
        alt: ((state.currentTab && state.currentTab.title) || '').trim().slice(0, 40),
        src: (state.currentTab && state.currentTab.url) || '',
    };
    render();
});

$('filter').addEventListener('input', (e) => {
    state.filter = e.target.value;
    renderList();
});

$('btnSave').addEventListener('click', () => onSave(false));
$('btnPush').addEventListener('click', () => onSave(true));

// ---------------- 初始化 ----------------

async function init() {
    $('btnSave').disabled = true;
    try {
        const r = await sendNative({ cmd: 'get' });
        state.tabs = r.tabs;
        state.groups = r.groups;
        state.repoRoot = r.repoRoot;
        state.activeNum = state.tabs.length ? state.tabs[0].num : null;
        render();
        refreshGit().catch(() => {});
    } catch (e) {
        hostDownHint(e);
        renderStat();
    }

    // 预填当前标签页
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && /^https?:/i.test(tab.url || '')) {
            state.currentTab = { url: tab.url, title: tab.title || '' };
        }
    } catch (e) { /* 忽略 */ }

    // 右键菜单暂存的“待添加”页面
    try {
        const { pendingAdd } = await chrome.storage.session.get('pendingAdd');
        if (pendingAdd && /^https?:/i.test(pendingAdd.url || '')) {
            state.showAdd = true;
            state.addPrefill = { alt: (pendingAdd.title || '').slice(0, 40), src: pendingAdd.url };
            chrome.storage.session.remove('pendingAdd');
            chrome.action.setBadgeText({ text: '' });
            render();
        }
    } catch (e) { /* 忽略 */ }
}

init();
