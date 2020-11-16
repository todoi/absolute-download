let contextmenuEvent

const span = document.createElement('span')
span.innerText = '这个位置没有图片，去其他位置试一下!';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>  {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (!!request.download) sendURL(getURL(contextmenuEvent))
  }
);

document.addEventListener('contextmenu', function(event) {
    contextmenuEvent = event;
    chrome.storage.sync.get('isDownloadDirectlyChecked', ({isDownloadDirectlyChecked}) => {
        if(isDownloadDirectlyChecked) {
            sendURL(getURL(event));
        }
    })
})

function sendURL(url) {
    chrome.runtime.sendMessage({ url }, function(response) {
        console.log('收到来自后台的回复：' + response);
    });
}


function getURL(event) {
    const url = findImg(event.target, event)?.src;
    if(!url) {
        throw new Error("can't find image");
    }
    return url;
}


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