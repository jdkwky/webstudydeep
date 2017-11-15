const fs = require('fs');

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register url mapping:GET ${path}`);
        } else if (url.startsWith('POST')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping:POST ${path}`);
        } else {
            console.log(`invalid url:${url}`);
        }
    }
}

function addControllers(router) {
    const files = fs.readdirSync(__dirname + '/controllers');
    // 过滤出js文件
    const js_files = files.filter(f => {
        return f.endsWith('.js');
    });
    // 处理每个js文件
    for (var f of js_files) {
        console.log(`process controller:${f}`);
        // 引入js文件
        let mapping = require(__dirname + '/controllers/' + f);
        addMapping(router, mapping);
    }
}
module.exports = function(dir) {
    let controllers_dir = dir || 'controllers',
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
}