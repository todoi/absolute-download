chrome.storage.sync.get('isDownloadDirectly', function({isDownloadDirectly}) {
    checkDownloadDirectly.checked = !!isDownloadDirectly;
});

chrome.storage.sync.get('isContextMenusHidden', function({isContextMenusHidden}) {
    hiddenContextMenus.checked = !!isContextMenusHidden;
});

checkDownloadDirectly.onclick = function(event) {
    chrome.storage.sync.set(
        { isDownloadDirectly: event.target.checked },
        () => console.log(`${value ? 'enable' : 'disable'} download directly`)
    );
};

hiddenContextMenus.onclick = function(event) {
    chrome.storage.sync.set(
        { isContextMenusHidden: event.target.checked },
        () => console.log(`${value ? 'hidden' : 'show'} context menus`)
    );
};