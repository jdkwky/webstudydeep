###### generator函数中的try catch

```javascript
function *test (){
    try {
        yield 'test'
    }catch(err){
        console.log(err);
    }

    throw 'eeee'
}

var t = test();
console.log(t.next());
console.log(t.next()); // eeee  错误不会被内部捕捉到 会被全局捕捉
```

普通函数 在try-catch块包裹外的报错 则不会被捕捉到， 会被全局捕捉
```javascript

function normal(){
    try{
        
    }catch(err){
        console.log(err)
    }
    throw 'error'
    
}

normal();   // 不会捕捉到错误
```
###### 简易co 执行模块( async await  )

```javascript
function co(fn) {
    const gen = fn();
    const t = gen.next();
    return new Promise((resolve, reject) => {
        function next(res) {
            if (res.done) {
                return resolve(res.value);
            }
            return Promise.resolve(res.value).then((val)=>{
                res = gen.next(val);
                next(res);
            })
        }
        next(t);
    });
}
```