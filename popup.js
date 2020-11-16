chrome.storage.sync.get('isRightClickChecked', function({isRightClickChecked}) {
    checkRightClick.checked = isRightClickChecked;
});

checkRightClick.onclick = function(event) {
    let value = event.target.checked;
    console.log(value)
    chrome.storage.sync.set({isRightClickChecked: value}, function() {
        console.log('update isRightClickChecked')
    });
};
