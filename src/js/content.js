let contextmenuEvent;
const toolTipRef = genToolTipRef();
let isContextMenusHidden;
const toolTipDefaultOpts = {
    content: "这个位置没有图片，去其他位置试一下!",
    quickClose: true,
    align: "top left",
}

customDialogUi();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (!!request.isContextMenuClicked) sendURL(getURL(contextmenuEvent));
});

chrome.storage.sync.onChanged.addListener(
    (changes, namespace) => (isContextMenusHidden = changes["isContextMenusHidden"].newValue)
);
chrome.storage.sync.get(
    "isContextMenusHidden",
    (data) => (isContextMenusHidden = data.isContextMenusHidden)
);

document.addEventListener("contextmenu", function (event) {
    if (!!isContextMenusHidden) {
        event.preventDefault();
    }
    contextmenuEvent = event;
    chrome.storage.sync.get("isDownloadDirectly", ({ isDownloadDirectly }) => {
        if (isDownloadDirectly) {
            sendURL(getURL(event));
        }
    });
});

function sendURL(url) {
    chrome.runtime.sendMessage({ url }, function (response) {
        console.log("收到来自后台的回复：" + response);
    });
}

function getURL(event) {
    const mousePosition = {
        x: event.clientX,
        y: event.clientY,
    };
    const url = findImg(event.target, mousePosition)?.src;
    console.log("evnet: ", event);
    if (!url) {
        showToolTip(toolTipRef, { x: event.pageX, y: event.pageY }, {
            align: isContextMenusHidden ? 'bottom left' : 'top left'
        });
        throw new Error("can't find image");
    }
    console.log("url: ", url);
    return url;
}

function genToolTipRef() {
    const toolTipRef = document.createElement("div");
    toolTipRef.style =
        "width: 1px; height: 1px; visibility: hidden; background: red; position: absolute; z-index: 999;";
    document.body.appendChild(toolTipRef);
    return toolTipRef;
}

function showToolTip(toolTipRef, { x, y }, opts = {}) {
    toolTipRef.style.left = x - 10 + "px";
    toolTipRef.style.top = y + 10 + "px";
    dialog({...toolTipDefaultOpts, ...opts}).show(toolTipRef);
}

function findImg(el, mousePosition) {
    const imgs = $(el).find("img");
    console.log("imgs: ", imgs);
    if (Object.prototype.toString.call(el) === "[object HTMLImageElement]") {
        console.log(1);
        return el;
    } else if (imgs?.length) {
        console.log(2);
        return [].slice.call(imgs).find((img) => isMouseOver(img, mousePosition));
    } else if (Object.prototype.toString.call(el) === "[object HTMLBodyElement]") {
        console.log(3);
        return null;
    } else {
        console.log(4);
        return findImg($(el).parent(), mousePosition);
    }
}

function isMouseOver(el, mousePosition) {
    const { left, right, top, bottom } = el.getBoundingClientRect();
    const { x, y } = mousePosition;
    console.log({ x, y, left, right, top, bottom });
    return x >= left && x <= right && y >= top && y <= bottom;
}

function customDialogUi() {
    const style = document.createElement("style");
    style.innerText = `
        .ui-popup-top-left .ui-dialog-arrow-b,
        .ui-popup-top-right .ui-dialog-arrow-b,
        .ui-popup-top .ui-dialog-arrow-b {border-top: 8px solid rgba(0,0,0,.70);}

        .ui-popup-bottom-left .ui-dialog-arrow-b,
        .ui-popup-bottom-right .ui-dialog-arrow-b,
        .ui-popup-bottom .ui-dialog-arrow-b { display: none; }

        .ui-popup-top-left .ui-dialog-arrow-a,
        .ui-popup-top-right .ui-dialog-arrow-a,
        .ui-popup-top .ui-dialog-arrow-a {display: none}

        .ui-popup-bottom-left .ui-dialog-arrow-a,
        .ui-popup-bottom-right .ui-dialog-arrow-a,
        .ui-popup-bottom .ui-dialog-arrow-a { border-bottom: 8px solid rgba(0,0,0,.70); }

        .ui-popup-top-left .ui-dialog,
        .ui-popup-top-right .ui-dialog,
        .ui-popup-top .ui-dialog,
        .ui-popup-bottom-left .ui-dialog,
        .ui-popup-bottom-right .ui-dialog,
        .ui-popup-bottom .ui-dialog {
            background-color: rgba(0,0,0,.75);
            color: #fff;
            box-shadow: 0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05);
        }
    `;
    document.head.appendChild(style);
}
