'use strict';
// 导入http模块
var http=require('http');
// 创建http server,并传入回调函数
var server=http.createServer(function(request,response){
	response.writeHead(200,{'content-Type':'text/html'});
	response.end('<h1>hello word</h1>');
});
server.listen(8888);
console.log('Server running at http://127.0.0.1:8888');