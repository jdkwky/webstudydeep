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

###### 3. 手写promise(详见index.html文件)


