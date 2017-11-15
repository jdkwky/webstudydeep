'use strict';
// const fs = require('fs');
// // var data=fs.readFileSync('./input.txt');
// // console.log(data.toString());
// // console.log('程序执行结束');
// const readInputFile=()=>{
//     fs.readFile('input.txt', function(error, data) {
//         if (error) return console.error(error);
//         console.log(data.toString());
//       });
// }
// readInputFile();
// fs.writeFile('input.txt','京东 jd.com',(error)=>{
//     if(error){
//         console.log(error);
//     }else{
//         console.log('写入成功');
//     }
// })
// readInputFile();
// ;console.log('程序执行结束！');

const fs=require('fs');
var rs=fs.createReadStream('input.txt','utf-8');
rs.on('data',function(chunk){
    console.log('DATA');
    console.log(chunk);
});
rs.on('end',function(){
    console.log('end');
})
rs.on('error',function(err){
    console.log('ERROR'+err);
})