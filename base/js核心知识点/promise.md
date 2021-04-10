###### 1. promise 异常

> 异常不会被try catch捕获  会在上层抛出

```javascript
var p = new Promise((resolve)=>{
    resolve(42);
});
try{
    p.then((val)=>{
        console.log(val,'val');
        throw 'errrr'
    },err =>{
        console.log(err,'err');
    })
}catch(er){
    console.log(er);
}
```

> promise 整体添加catch就会捕获异常

```javascript
var p = new Promise((resolve)=>{
    resolve(42);
});
p.then(val=>{
    console.log(val,'val');
    throw 'errrr'
}).catch(err =>{
    console.log(err,'err');
})
```

###### 2. promise.all
```javascript
function promiseAll2(promises) {
    return new Promise(function(resolve, reject) {
        var resolvedCounter = 0;
        var promiseNum = promises.length;
        var resolvedValues = new Array(promiseNum);
        for (let i = 0; i < promiseNum; i++) {
            
            Promise.resolve(promises[i]).then(
                function(value) {
                    resolvedCounter++;
                    resolvedValues[i] = value;
                    if (resolvedCounter == promiseNum) {
                        return resolve(resolvedValues);
                    }
                },
                function(reason) {
                    return reject(reason);
                }
            );
            
        }
    });
}
```

######  3. 手写promise.race

```javascript
function PromiseRace(list){
    return new Promise((resolve, reject) =>{
        for(let i = 0, len = list.length; i < len ;i++){
            const temp = list[i];
            temp.then(res =>{
                resolve(res);
            }).catch(err =>{
                reject(err);
            })
        }
    });
}
```

###### 4. 手写promise.finally

```javascript
const p = new Promise(resolve=>{
    setTimeout(()=>{
        resolve(100)
    },1000)
});




Promise.prototype.myFinally = function(callback){
    const P = this.constructor;

    return this.then(
        value => P.resolve(callback()).then(()=> value),
        err =>  P.resolve(callback()).then(()=> {throw err})
    )
}


p.myFinally(res =>{
    console.log(res, 'finally');  // 100ms 之后输出 undefined
}).then(res =>{
    console.log(res, 'then')  // finally 之后输出 100
});
```

###### 5. 手写promise

```javascript
function CutePromise(executor){
    this.value = null;
    this.reason = null;
    this.status = 'pending';
    this.onResolvedQueue = [];
    this.onRejectedQueue = [];
    var self = this;

    function resolve(value){
        if(self.status !=='pending'){
            return;
        }
        self.value = value;
        self.status = 'resolved';
        self.onResolvedQueue.forEach(resolved => resolved(self.value));

    }

    function reject (reason){
        if(self.status !=='pending'){
            return;
        }
        self.reason = reason;
        self.status = 'rejected';

        self.onRejectedQueue.forEach(rejected => rejected(self.reason));

    }

    executor(resolve, reject);
}

function resolutionProcedure(promise2, x, resolve, reject){
    // 
    let hasCalled;
    if(x === promise2){
        return reject(new TypeError('避免死循环  报错'));
    }else if ( x !== null && (typeof x === 'object' || typeof x ==='function') ){
        try{
            let then = x.then;
            if(typeof then === 'function'){
                then.call(x, y=>{
                    if(hasCalled) return;
                    hasCalled = true;
                    resolutionProcedure(promise2,y, resolve, reject);
                },err =>{
                    if(hasCalled) return;
                    hasCalled = true;
                    reject(err);
                })
            }else{
                resolve(x);
            }
        }catch(e){
            if(hasCalled) return ;
            hasCalled = true;
            reject(e);
        }
    }else{
        resolve(x);
    }
}


CutePromise.prototype.then = function(onResolved, onRejected){
    if(typeof onResolved !== 'function'){
        onResolved = function(x) { return x };
    }
    if(typeof onRejected !== 'function'){
        onRejected = function(e) { throw e };
    }

    var self = this;
    // 这个变量用来存返回值 x
    let x

    // resolve态的处理函数
    function resolveByStatus(resolve, reject) {
        // 包装成异步任务，确保决议程序在 then 后执行
        setTimeout(function() {
            try { 
                // 返回值赋值给 x
                x = onResolved(self.value);
                // 进入决议程序
                resolutionProcedure(promise2, x, resolve, reject);
            } catch (e) {
                // 如果onResolved或者onRejected抛出异常error，则promise2必须被rejected，用error做reason
                reject(e);
            }
        },0);
    }

    // reject态的处理函数
    function rejectByStatus(resolve, reject) {
        // 包装成异步任务，确保决议程序在 then 后执行
        setTimeout(function() {
            try {
                // 返回值赋值给 x
                x = onRejected(self.reason);
                // 进入决议程序
                resolutionProcedure(promise2, x, resolve, reject);
            } catch (e) {
                reject(e);
            }
        },0);
    }


    // 注意，这里我们不能再简单粗暴 return this 了，需要 return 一个符合规范的 Promise 对象
    var promise2 = new CutePromise(function(resolve, reject) {
        // 判断状态，分配对应的处理函数
        if (self.status === 'resolved') {
            // resolve 处理函数
            resolveByStatus(resolve, reject);
        } else if (self.status === 'rejected') {
            // reject 处理函数
            rejectByStatus(resolve, reject);
        } else if (self.status === 'pending') {
            // 若是 pending ，则将任务推入对应队列
            self.onResolvedQueue.push(function() {
                resolveByStatus(resolve, reject);
            });
            self.onRejectedQueue.push(function() {
                rejectByStatus(resolve, reject);
            });
        }
    });

    // 把包装好的 promise2 return 掉
    return promise2;
}

```

