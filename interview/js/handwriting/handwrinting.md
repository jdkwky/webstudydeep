#### 手写一些原生方法的实现

1. 实现一个new操作符

> - 创建空对象
> - __proto__指向 对象的原型（prototype）
> - 更改this指向

```
function _new(fn, ...args) {

   if (Object.prototype.toString.call(fn) === '[object Function]') {
       const obj = {};
       obj.__proto__ = fn.prototype;
       const result = fn.apply(obj, args);
       if (result) {
           return result;
       }
       return obj;
   }
   throw ('fn is need to be function')
} 
```

2. 实现一个JSON.stringify

> - 不可转换数据： undefined、symbol、function
> - 自动转换： String、 Number、Boolean、Date 自动转换成string类型

```
<!-- 判断是否是可转换数据 -->
function changeText(params) {
   const regxIgnore = /undefined|symbol|function/;
   const regxString = /string|boolean|number/;
   if (regxIgnore.test(typeof params)) {
       return '';
   } else if (
       regxString.test(typeof params) ||
       params instanceof String ||
       params instanceof Number ||
       params instanceof Boolean ||
       params instanceof Date
   ) {
       return '"' + String(params) + '"';
   }
   return '"' + String(params) + '"';
}

function jsonStringify(params, index = 0) {

   const regxIgnore = /undefined|symbol|function/;
   const regxString = /string|boolean|number/;
   if (regxIgnore.test(typeof params)) {
       return '';
   } else if (
       regxString.test(typeof params) ||
       params instanceof String ||
       params instanceof Number ||
       params instanceof Boolean ||
       params instanceof Date
   ) {
       return '"' + String(params) + '"';
   } else {
       // 对象或者数组
       // 判断是对象或者是数组
       const isArray = Object.prototype.toString.call(params) === '[object Array]';
       let result = '';
       if (isArray) {
           // 数组
           if (index == 0) {
               result = '"';
           }
           result += '[';
           for (let val of params) {
               if (typeof val == 'object' && val) {
                   const i = index + 1;
                   const v = jsonStringify(val, i);
                   result += v + ',';
               } else if (val) {
                   const temp = changeText(val);
                   if (temp) {
                       result += temp + ',';
                   }
               }
           }
           result = result.substring(0, result.length - 1);
           result += ']';
           if (index == 0) {
               result += '"';
           }
       } else {
           // 对象
           if (index == 0) {
               result = '"';
           }
           result += '{';
           for (let val in params) {
               if (typeof params[val] == 'object' && params[val]) {
                   const ai = index + 1;
                   const v = jsonStringify(params[val], ai);
                   result += '"' + val + '"' + ':' + v + ',';
               } else if (params[val]) {
                   const temp = changeText(params[val]);
                   if (temp) {
                       result += '"' + val + '"' + ':' + temp + ',';
                   }
               } else {
                   result += ',';
               }
           }
           result = result.substring(0, result.length - 1);
           result += '}';
           if (index == 0) {
               result += '"';
           }
       }
       return result;
   }
}

```

3. 实现一个 call 或者 apply

> - call  param1: this指向， paramN: n个参数
> - apply param1: this指向， param2: 数组参数

```
    Function.prototype._call = function (params) {
      const context = arguments[0];
      if (context) {
          const args = [...arguments].slice(1);
          context.fn = this;
          const res = context.fn(args);
          delete context.fn;
          return res;
      } else {
          return this([...arguments].slice(1));
      }
    };

```

4. 实现一个bind函数
> - 返回一个改变this指向的函数

```
Function.prototype._bind = function () {
   var slice = Array.prototype.slice;
   var thatFunc = this, thatArg = arguments[0];
   var args = slice.call(arguments, 1);
   if (typeof thatFunc !== 'function') {
       // closest thing possible to the ECMAScript 5
       // internal IsCallable function
       throw new TypeError('Function.prototype.bind - ' +
           'what is trying to be bound is not callable');
   }
   return function () {
       var funcArgs = args.concat(slice.call(arguments))
       return thatFunc.apply(thatArg, funcArgs);
   };
};
```

5. 实现一个继承

> - 混合继承

```
function Parent() {
      this.colors = [];
      this.name = 'parent'
}

Parent.prototype.addColors = function (color) {
   this.colors.push(color)
}

function Sub() {
   Parent.call(this);
   this.name = 'sub';
   this.list.push('sublist');
}

Sub.prototype = Object.create(Parent.prototype);

```

6. 实现一个JS函数柯里化

> 什么是柯里化： 在计算机科学中，柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。

```
function curry(fn) {
   const length = fn.length;
   let args = [...arguments].slice(1);
   return function curryFn() {
       args = args.concat([...arguments]);
       if (args.length === length) {
           return fn.apply(null, args);
       } else {
           return curryFn;
       }
   }
}
```

7. 手写一个promise

```
function _Promise(fn) {
   this.fulfilled = 1;
   this.rejected = 2;
   this.pending = 0;
   this.status = this.pending;
   this.value = null;
   this.error = null;
   this.handlers = [];
   return this.doResolve(fn);
}
// 执行构造函数
_Promise.prototype.doResolve = function (fn) {

   fn && fn.call(this, this.resolve.bind(this), this.reject.bind(this));
}

_Promise.prototype.done = function (onFulfilled, onRejected) {
   setTimeout(() => {
       return this.handle({
           onFulfilled: onFulfilled,
           onRejected: onRejected
       })
   }, 0)
}
//  fulfill
_Promise.prototype.fulfill = function (value) {
   this.status = this.fulfilled;
   this.value = value;
   this.handlers.forEach(this.handle.bind(this));

   this.handlers = []
};

// resolve
_Promise.prototype.resolve = function (value) {

   if (value instanceof _Promise && value.then) {
       return this.doResolve(value.then.bind(value), this.resolve, this.reject);
   }
   this.fulfill(value)
}
// reject
_Promise.prototype.reject = function (error) {
   this.status = this.rejected;
   this.error = error;

   this.handlers.forEach(this.handle);
   this.handlers = []
}

_Promise.prototype.handle = function (obj) {


   if (this.status == this.pending) {
       this.handlers.push(obj);

   } else if (this.status == this.rejected) {
       return obj && obj.onRejected.call(this, this.error);
   } else if (this.status == this.fulfilled) {
       return obj && obj.onFulfilled.call(this, this.value);
   }

}
// then
_Promise.prototype.then = function (onFulfilled, onRejected) {
   const _this = this;
   return new _Promise(function (resolve, reject) {
       return _this.done((result) => {
           if (onFulfilled) {
               return resolve(onFulfilled && onFulfilled.call(_this, result));
           } else {
               return resolve(result)
           }
       }, (error) => {
           if (onRejected) {
               return reject(onRejected && onRejected.call(_this, error));
           } else {
               return reject(error)
           }
       })
   })
}


```

8. 手写防抖(Debouncing)和节流(Throttling)

> 防抖： 触发高频事件后 n 秒内只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间
> 节流： 高频事件n秒内只会触发一次，所以节流会稀释函数的执行频率

```
<!-- 防抖 -->
function debouncing(fn, delayMs) {
   let time = null;
   return function (...args) {
       if (time) {
           clearTimeout(time);
       }
       time = setTimeout(() => {
           fn && fn.apply(null, args)
       }, delayMs)
   }
}
```

```
<!-- 节流 -->
function throttling(fn, ms) {
   let flag = false;
   let preTime = +new Date();

   return function (...args) {
       const now = +new Date();

       if (now - preTime > ms) {
           flag = false;
           preTime = now;
       } else {
           if (!flag) {
               flag = true;
               fn && fn.apply(null, args);
           }
       }
   }
}

```

9. 手写一个js深拷贝

```
 function deepCopy(obj) {
      if (typeof obj == "object") {
          var result = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {};
          for (let i in obj) {
              result[i] = typeof obj[i] == "object" ? deepCopy(obj[i]) : obj[i];
          }
      } else {
          var result = obj;
      }
      return result;
}

```

10. 实现一个instanceOf
> 注意： 只是示例， 一些参数的特定校验规则并没有写在里面

```
function _instanceof(l, r) {
    var o = r.prototype;
    l = l.__proto__;
    while (true) {
        if (l === null) {
            return false;
        }
        if (o === l) {
            return true;
        }
        l = l.__proto__;
    }
}
```

11. typeof
>  根据二进制判断，所以 typeof null 被判断成了对象

- 000：对象
- 1：整数
- 010：浮点数
- 100：字符串
- 110：布尔

有 2 个值比较特殊：

- undefined：用 - （−2^30）表示。
- null：对应机器码的 NULL 指针，一般是全零。

```
if (JSVAL_IS_VOID(v)) {  // (1)
    type = JSTYPE_VOID;
} else if (JSVAL_IS_OBJECT(v)) {  // (2)
    obj = JSVAL_TO_OBJECT(v);
    if (obj &&
        (ops = obj->map->ops,
            ops == &js_ObjectOps
            ? (clasp = OBJ_GET_CLASS(cx, obj),
            clasp->call || clasp == &js_FunctionClass) // (3,4)
            : ops->call != 0)) {  // (3)
        type = JSTYPE_FUNCTION;
    } else {
        type = JSTYPE_OBJECT;
    }
} else if (JSVAL_IS_NUMBER(v)) {
    type = JSTYPE_NUMBER;
} else if (JSVAL_IS_STRING(v)) {
    type = JSTYPE_STRING;
} else if (JSVAL_IS_BOOLEAN(v)) {
    type = JSTYPE_BOOLEAN;
}
```

（1）：判断是否为 undefined
（2）：如果不是 undefined，判断是否为对象
（3）：如果不是对象，判断是否为数字
（4）：。。。

这样一来，null 就出了一个 bug。根据 type tags 信息，低位是 000，因此 null 被判断成了一个对象。这就是为什么 typeof null 的返回值是 object。

12. 实现一个co模块

```
function co(genenratorFn) {
    var gen = genenratorFn();
    var it = gen.next();

    return new Promise((resolve, reject) => {
        const next = function () {
            if (it.done) {
                resolve(it.value);
            } else {
                it.value = Promise.resolve(it.value);
                it.value.then((result) => {
                    it = gen.next(result);
                    next(it)
                });
                it.value.catch((err) => {
                    reject(err)
                })
            }
        }
        next(it)
    })
}

```


