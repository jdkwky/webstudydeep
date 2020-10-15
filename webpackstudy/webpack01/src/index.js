// const hello = require('./a');
// console.log(hello, 'haha');

// require('./index.css');
// require('./less.less');

// class A {
//     a = 1;
// }
// console.log(new A().a);

// new Promise(resolve => {
//     resolve(1);
// }).then(res => {
//     console.log(res, ' index 16');
// });

// require('@babel/polyfill');

// console.log('aaa'.includes('a'), 'includes 20');

// console.log($, '22 index');

/**
 * 引入图片
 */
import birdImg from './bird.jpg';
const img = new Image();
img.src = birdImg;
document.body.appendChild(img);

console.log('d');

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
console.log(moment().subtract(6, 'days').calendar());

import React from 'react';
import { render } from 'react-dom';

render(<h1>jsx</h1>, window.root);

import name from './a';
console.log('index', name);
