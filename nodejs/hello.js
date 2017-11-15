function hello(){
    console.log('hello word');
}
function helloName(){
    console.log('hello name');
}
// require 引入的模块是module.exports导出的模块
module.exports={
    hello,
    helloName
}
// 也可以用 exports 导出模块
exports.hello=hello;
exports.helloName=helloName;
// 不能修改通过直接给exports赋值的形式更改exports的值
exports={
    hello,
    helloName
}