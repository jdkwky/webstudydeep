
document.ready = function (callback) {
    ///兼容FF,Google
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function () {
            document.removeEventListener('DOMContentLoaded', arguments.callee, false);
            callback();
        }, false)
    }
    //兼容IE
    else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState == "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                callback();
            }
        })
    }
    else if (document.lastChild == document.body) {
        callback();
    }
}

document.ready(
    // init
    initHistory
);


function init() {
    // 页面上hash值有变化 就会触发此方法
    window.addEventListener('hashchange', (event) => {

        var showText = document.getElementById('showText');
        showText.innerText = location.hash;
    })
    console.log(document.links.length);

}

function initHistory() {
    document.querySelector('.linkWrap').onclick = function (event) {
        var path = event.target.dataset && event.target.dataset.path;
        var showText = document.getElementById('showText');
        showText.innerText = path;
        history.pushState('', '', ' #/' + path)

    }
}


