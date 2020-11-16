chrome.storage.sync.get('isDownloadDirectlyChecked', function({isDownloadDirectlyChecked}) {
    checkDownloadDirectly.checked = !!isDownloadDirectlyChecked;
});

checkDownloadDirectly.onclick = function(event) {
    let value = event.target.checked;
    console.log(value)
    chrome.storage.sync.set({isDownloadDirectlyChecked: value}, function() {
        console.log(`${value ? 'enable' : 'disable'} download directly`)
    });
};
