const TOP_MENU_ID = 'asbolute-download'
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: TOP_MENU_ID,
        title: "下载图片",
        contexts: ["page", "frame", "selection", "link", "editable", "image", "video", "audio"],
    });
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        if(info.menuItemId === TOP_MENU_ID) {
            console.log('='.repeat(20))
            chrome.tabs.query(
                {active: true, currentWindow: true},
                tabs => chrome.tabs.sendMessage(
                    tabs[0].id,
                    {download: true},
                    function(response) {
                        console.log(response);
                    }
                )
            );
        }
    })
});

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('收到来自content-script的消息：');
    console.log(request, sender, sendResponse);
    url = request?.url;
    if(url) chrome.downloads.download({ url });
    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});
