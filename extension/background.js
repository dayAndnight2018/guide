// Guide 导航管理 - Service Worker
// 右键菜单：把当前页/链接暂存，待 popup 打开时预填到“添加”表单

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: 'guide-add',
            title: '添加到 Guide 导航',
            contexts: ['page', 'link'],
        });
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== 'guide-add') return;
    // 右键链接时优先用链接；否则用当前页
    const url = info.linkUrl || info.pageUrl || (tab && tab.url) || '';
    const title = info.linkUrl ? '' : ((tab && tab.title) || '');
    if (!/^https?:\/\//i.test(url)) return;

    try {
        await chrome.storage.session.set({ pendingAdd: { url, title } });
        await chrome.action.setBadgeText({ text: '1' });
        await chrome.action.setBadgeBackgroundColor({ color: '#e8603c' });
    } catch (e) {
        // storage.session 不可用时静默忽略
    }
});
