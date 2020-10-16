// 仿制tapable 流形势 实现代码
// 同步代码
// class SyncHook {
//     constructor() {
//         this.tasks = [];
//     }
//     tap(name, fn) {
//         this.tasks.push(fn);
//     }
//     call(...args) {
//         this.tasks.forEach(task => {
//             task(...args);
//         });
//     }
// }

// const hook = new SyncHook(['name']);

// hook.tap('hello', name => {
//     console.log(`hello ${name}`);
// });

// hook.tap('Hello again', name => {
//     console.log(`Hello ${name},again`);
// });

// hook.call('ahonn');

// 熔断型钩子
// class SyncBailHook {
//     constructor() {
//         this.tasks = [];
//     }
//     tap(name, fn) {
//         this.tasks.push(fn);
//     }
//     call(...args) {
//         let index = 0,
//             length = this.tasks.length,
//             tasks = this.tasks;
//         let result;
//         do {
//             result = tasks[index](...args);
//             index++;
//         } while (result == null && index < length);
//     }
// }

// const hook = new SyncBailHook(['name']);
// hook.tap('node', function(name) {
//     console.log('node', name);
//     return '停止学习';
// });
// hook.tap('react', function(name) {
//     console.log('react', name);
// });

// hook.call('wkyyc');

// 前一个的返回结果 是后一个的入参
// class SyncWaterfallHook {
//     constructor() {
//         this.tasks = [];
//     }

//     tap(name, fn) {
//         this.tasks.push(fn);
//     }
//     call(...args) {
//         const [firstFn, ...others] = this.tasks;
//         others.reduce((sum, task) => task(sum), firstFn(...args));
//     }
// }

// const hook = new SyncWaterfallHook(['name']);
// hook.tap('node', function(name) {
//     console.log('node', name);
//     return 'node 学的还不错';
// });
// hook.tap('react', function(data) {
//     console.log('react', data);
// });

// hook.call('wkyyc');

// 异步钩子  并发执行的异步钩子

// class AsyncParallelHook {
//     constructor() {
//         this.tasks = [];
//     }
//     tapAsync(name, fn) {
//         this.tasks.push(fn);
//     }
//     callAsync(...args) {
//         // 要最后执行的函数
//         const callbackFn = args.pop();
//         let index = 0;
//         const next = () => {
//             index++;
//             if (index == this.tasks.length) {
//                 callbackFn();
//             }
//         };

//         this.tasks.forEach(task => {
//             task(...args, next);
//         });
//     }
// }
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
//     }, 3000);
// });

// hook.callAsync('wkyyc', () => {
//     console.log('end');
// });

// 异步 中的同步执行钩子

class AsyncSeriesHook {
    constructor() {
        this.tasks = [];
    }

    tapPromise(name, fn) {
        this.tasks.push(fn);
    }
    promise(...args) {
        const [firstFn, ...others] = this.tasks;

        return others.reduce(
            (sum, task) =>
                sum.then(() => {
                    return task(...args);
                }),
            firstFn(...args)
        );
    }
}
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
