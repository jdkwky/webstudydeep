// 同步
// const { SyncHook } = require('tapable');

// const hook = new SyncHook(['name']);

// hook.tap('hello', name => {
//     console.log(`hello ${name}`);
// });

// hook.tap('Hello again', name => {
//     console.log(`Hello ${name},again`);
// });

// hook.call('ahonn');

// SyncBailHook  熔断性执行

// const { SyncBailHook } = require('tapable');

// const hook = new SyncBailHook(['name']);
// hook.tap('node', function(name) {
//     console.log('node', name);
//     // return '停止学习';
// });
// hook.tap('react', function(name) {
//     console.log('react', name);
// });

// hook.call('wkyyc');

/**

// SyncWaterfallHook 同步瀑布钩子 上一个监听函数的值会传递给下一个监听函数

const { SyncWaterfallHook } = require('tapable');

const hook = new SyncWaterfallHook(['name']);
hook.tap('node', function(name) {
    console.log('node', name);
    return 'node 学的还不错';
});
hook.tap('react', function(data) {
    console.log('react', data);
});

hook.call('wkyyc');
*/

// 异步钩子, 并行执行的异步钩子，当注册的所有异步回调都并行执行完毕之后再执行callAsync或者promise中的函数

// const { AsyncParallelHook } = require('tapable');
// const hook = new AsyncParallelHook(['name']);

// hook.tapAsync('hello', (name, cb) => {
//     setTimeout(() => {
//         console.log(`hello ${name}`);
//         cb();
//     }, 1000);
// });

// hook.tapAsync('hello again', (name, cb) => {
//     setTimeout(() => {
//         console.log(`Hello ${name} again`);
//         cb();
//     }, 2000);
// });

// hook.callAsync('wkyyc', () => {
//     console.log('end');
// });

const { AsyncSeriesHook } = require('tapable');
const hook = new AsyncSeriesHook(['name']);

hook.tapPromise('hello', name => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`hello ${name}`);
            resolve();
        }, 1000);
    });
});

hook.tapPromise('hello again', data => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`Hello ${data} again`);
            resolve();
        }, 1000);
    });
});

hook.promise('wkyyc').then(() => {
    console.log('end');
});
