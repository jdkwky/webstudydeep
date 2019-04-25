// 全局变量  
const PENDING = 0 ;
const FULFILLED = 1 ; 
const REJECTED = 2 ;

function Promise (fn) {
    let state = PENDING;
    let value = null;
    let handlers = [];

    function fulfill( reslut ){
        state = FULFILLED ; 
        value = reslut
        handlers.forEach(handle);
        handlers = [];
    }

    function reject (error) {
        state = REJECTED;
        value = error;
        handlers.forEach(handle);
        handlers = [];
    }

    function handle (handler){
        if( state === PENDING ){
            handlers.push(handler);
        }else if ( state === FULFILLED && typeof handler.onFulfilled === 'function' ){
            handler.onFulfilled(value);
        }else if ( state === REJECTED && typeof handler.onRejected === 'function' ){
            handler.onRejected(value);
        }
    }

    function getThen(reslut) {
        if( typeof reslut ==='object' || typeof reslut === 'function' ){
            if( reslut.then && typeof reslut.then === 'function' ){
                return reslut.then;
            }
        }
        return null;
    }

    function doResolve (fn , resolve, reject){
        fn(function(reslut){
            resolve(reslut);
        }, function(reslut){
            reject(reject);;
        });
    }

    function resolve ( newResult ) {
        // 判断newResult是否具有thenabel对象
        const then = getThen(newResult);
        if(then){
            doResolve(then.bind(newResult), resolve, reject); 
            return ;
        }
        fulfill(newResult);
    }

    doResolve(fn, resolve,reject);

    this.done = function (onFulfilled, onRejected){
        setTimeout(() => {
            handle({
                onFulfilled: onFulfilled,
                onRejected : onRejected
            });
        }, 0);
    }

    this.then = function ( onFulfilled, onRejected ){
        const _this = this;
        return new Promise( function (resolve, reject ){
            return _this.done(function(reslut){
                if( onFulfilled && typeof onFulfilled === 'function' ){
                    return resolve(onFulfilled(reslut));
                }else {
                    return resolve(reslut);
                }
            },function(reslut){
                if(onRejected && typeof onRejected === 'function'){
                    return reject(onRejected(reslut));
                }else{
                    return reject(reslut);
                }
            })
        });
    }

}