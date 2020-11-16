document.addEventListener('contextmenu', function(e) {
    const url = findImg(e.target).src;
    chrome.runtime.sendMessage({ url }, function(response) {
        console.log('收到来自后台的回复：' + response);
    });

})

function findImg(el) {
    const parent = $(el).parent();
    const imgs = parent.find('img')
    if(Object.prototype.toString.call(el) ==="[object HTMLImageElement]") {
        return el
    }
    else if(imgs?.length) {
        return imgs[0]
    }
    else if(Object.prototype.toString.call(document.body) === "[object HTMLBodyElement]") {
        throw new Error("can't find image");
        alert('没有找到你想要的图片')
    }
    else {
        findImg(parent);
    }
}