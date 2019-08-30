window.onload = function () {
    var $div = document.getElementById('div');
    var $span = document.getElementById('span');
    console.log($div.nodeName, $div.nodeType, $div.nodeValue, 'div');
    console.log($span.nodeName, $span.nodeType, $span.nodeValue, 'span');
    console.log($div.childNodes)
    console.log($div.firstChild, $div.lastChild)
    console.log($div.ownerDocument);

    //  ownerDocument 属于哪个document文档

    var $img = document.getElementById('img')
    console.log($img.childNodes);
    var $html = document.documentElement;
    var $body = document.body;
    console.log($html.nodeType, $html.nodeValue);
    console.log($body.nodeType, $body.nodeValue);

    document.title = "test"

    var url = document.url;
    var domain = document.domain;
    var referrer = document.referrer;

    console.log(url, domain, referrer);

    console.log('==========================');

    console.log($div.title, $div.id, $div.className);

    var divName = $div.getAttribute('data-name');

    console.log(divName, 'divName');


    $div.title = 'dddtest';
    $div.testName = 'testName';
    console.log($div.getAttribute('testName'));

    $div.setAttribute('testAge', 18);
    console.log($div.getAttribute('testAge'))

    console.log($div.attributes['data-name'].nodeValue)


    var $p = document.getElementById('p');

    var textNode = document.createTextNode('hello world');
    $p.appendChild(textNode);
    var anotherTextNode = document.createTextNode('China!!!');

    $p.appendChild(anotherTextNode);

    console.log($p.childNodes.length);

    $p.normalize();
    console.log($p.childNodes.length);


    // 拖放功能

    // 拖放事件
    // dragStart  鼠标开始移动
    // drag   dragStart事件开始之后就出发drag事件 在元素被拖动期间会继续出发该事件。
    // dragEnd   放到了有效目标上 会出发dragEnd事件

    // 当某个元素被拖动到一个有效的放置目标上时，下列事件会依次发生：
    // 1) dragEnter
    // 2) dragover
    // 3) dragleave 或 drop

    // 只要有元素被拖动到放置目标上，就会触发dragenter事件。紧随其后的是dragover事件，而且在被拖动的元素还在
    // 放置目标的范围内移动时，就会持续触发该事件。如果元素被拖出了放置目标，dragover事件不再发生
    // 但是会出发dragleave事件上述三个事件的目标都是作为放置目标的元素

    var $drag = document.getElementById('drag');

    // $drag.addEventListener('dragstart', (event) => {
    //     console.log('start', event);
    // });

    // $drag.addEventListener('drag', (event) => {
    //     console.log('drag', event);
    // });
    $drag.addEventListener('dragend', (event) => {
        const { pageX, pageY } = event || {};
        console.log(event, 'event');

        $drag.style.top = pageY + 'px';
        $drag.style.left = pageX + 'px';
    });


    // document.addEventListener('dragenter', (event) => {
    //     console.log(event, 'enter');

    // });
    // document.addEventListener('dragover', (event) => {
    //     console.log(event, 'over');

    // });
    // document.addEventListener('dragleave', (event) => {
    //     console.log(event, 'leave');

    // });



}