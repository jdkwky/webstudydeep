'use strict';
const crypto=require('crypto');
const hash=crypto.createHash('md5');
// 可以任意调用多次update
hash.update('hello,word');
hash.update('hello,nodejs');
console.log(hash.digest('hex'));