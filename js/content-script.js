document.addEventListener('contextmenu', function(event) {
    const url = findImg(event.target, event)?.src;
    if(!url) {
        alert('这个位置没有图片，去其他位置试一下!')
        throw new Error("can't find image");
    }
    chrome.runtime.sendMessage({ url }, function(response) {
        console.log('收到来自后台的回复：' + response);
    });

})

function findImg(el, event) {
    const parent = $(el).parent();
    const imgs = parent.find('img')
    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    };
    if(Object.prototype.toString.call(el) ==="[object HTMLImageElement]") {
        return el
    }
    else if(imgs?.length) {
        return [].slice.call(imgs).find(img => isMouseOver(img, mousePosition))
    }
    else if(Object.prototype.toString.call(document.body) === "[object HTMLBodyElement]") {
        return null;
    }
    else {
        findImg(parent);
    }
}

function isMouseOver(el, mousePosition) {
    const {left, right, top, bottom} = el.getBoundingClientRect();
    const {x, y} = mousePosition;
    return x >= left && x <= right && y >= top && y <= bottom;
}