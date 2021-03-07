###### 对象和原型

1. 存在性 (`in` 与 `hasOwnProperty`)
```
    // 存在性   hasOwnProperty 和 in

    var obj = {
        a: 'a'
    }
    var objSub = {};
    objSub.__proto__ = obj;
    objSub.b = 'b';
    console.log(objSub);


    console.log('b' in objSub, 'in b');  // true
    console.log('a' in objSub, 'in a');  // true

    console.log(objSub.hasOwnProperty('a'), 'hasOwnProperty a');  // false
    console.log(objSub.hasOwnProperty('b'), 'hasOwnProperty b');  // true
```

`in` 不光便利当前属性`还会便利原型链`上的属性，`hasOwnProperty` 只会便利当前存在的属性，`不会便利原型链`上存在的属性。

普通对象都能通过Object.prototype的委托访问hasOwnProperty,但是有的对象可能没有链接到Object.prototype(通过Object.create(null)创建的)，可以通过Object.prototype.hasOwnProperty.call(objSub,'a')调用

2. 对象遍历

    | 方式    | 性能(ms) | return                                             | continue | break | 适用范围                                     |
    | ------- | -------- | -------------------------------------------------- | -------- | ----- | -------------------------------------------- |
    | for     | 10       | ✅（函数中的for支持）                               | ✅        | ✅     | 数组、类数组                                 |
    | forEach | 99       | ✅ (并不会return回去值，而是类似continue会跳过执行) | ❌        | ❌     | 数组                                         |
    | for in  | 4742     | 同for                                              | ✅        | ✅     | 数组，对象 val表示key值，数组中就表示index值 |
    | for of  | 112      | 同for                                              | ✅        | ✅     | 数组 val表示value值                          |
    

   > 性能最好的就是for 其次forEach 再其次是for of 最后是for in , 所以尽量避免for in操作
   > for of 只能遍历存在内置iterator的对象，不能遍历普通对象

   ```
    <!-- 1千万数据写入 -->
    var list = new Array(10000000)
    var start = +new Date;
    for (let i = 0, len = list.length; i < len; i++) {
        list[i] = 1;
    }
    var end = +new Date;
    console.log(end - start, 'for');
    var start = +new Date;
    list.forEach((val) => {
        val = 1;
    });
    var end = +new Date;
    console.log(end - start, 'forEach');

    var start = +new Date;
    for (let i in list) {
        list[i] = 1
    }
    var end = +new Date;
    console.log(end - start, 'for in');

    var start = +new Date;
    for (let val of list) {
        val = 1;
    }
    var end = +new Date;
    console.log(end - start, 'for of ');

   ```

   想让对象可以通过for of遍历 就需要 重新配置`Symbol.iterator`属性

    - Symbol.iterator  迭代器
    - Symbol.hasInstance  控制instanceof 指向
    - Symbol.toPrimitive  对象被转换成原始类型时调用这个
    - Symbol.toStringTag  影响Object.prototype.toString返回的值
    Symbol还存在很多内置参数，详细的参考 href: http://es6.ruanyifeng.com/#docs/symbol#%E5%86%85%E7%BD%AE%E7%9A%84-Symbol-%E5%80%BC

   ```
   var obj = {
        a: 1,
        b: 2
    }

    Object.defineProperty(obj, Symbol.iterator, {
        enumerable: false,
        writable: false,
        configurable: true,      // 只要属性是可配置的，defineProperty就不会报错，否则就会报错
        value: function () {
            var o = this;
            var idx = 0;
            var ks = Object.keys(o);
            return {
                next: function () {
                    return {
                        value: o[ks[idx++]],
                        done: (idx > ks.length)
                    }
                }
            }
        }
    })

    for (let i of obj) {
        console.log(i); // 1 2

    }

   ```


   Object相关

   1. Object.create 做了什么  改变当前对象原型链

    ```
    // Object.create  做了什么

    var ObjectCreate = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        }

        if (typeof propertiesObject != 'undefined') throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");

        function F() { }
        F.prototype = proto;

        return new F();
    };
    ```


    1. 继承

    ```
        <!-- 原型继承 -->
        function Father() {
            this.nameList = ['a', 'b', 'c'];
        }

        Father.prototype.sayNames = function () {
            console.log(this.nameList.join(','))
        }

        Father.prototype.pushName = function (name) {
            this.nameList.push(name)
        }


        <!--  -->
        function Sun() { }

        Sun.prototype = new Father() 
        var sun = new Sun();
        var father = new Father();
        var sun1 = new Sun();


        sun.sayNames();
        sun.pushName('wky')
        sun.sayNames();   //   wky
        sun1.sayNames();  // wky  明明没有添加过wky   干扰了
        <!--  -->

        <!-- 混合继承 -->
        function Sun() {
              Father.apply(this, arguments)
        }

        Sun.prototype = Father.prototype;


        var sun = new Sun();
        var sun2 = new Sun();
        var father = new Father();
        sun.sayNames();

        sun.pushName('wky')
        sun.sayNames();  // a, b ,c, wky     互补干扰
        sun2.sayNames() // a,b,c

    ```

    1. new 都做了什么
    >  - 改变this指向
    >  - 增加__proto__属性

    ```
    function polifyNew() {
        var context = Array.prototype.slice.call(arguments, 0, 1)[0];
        var args = Array.prototype.slice.call(arguments, 1);
        var obj = {};
        obj.__proto__ = context.prototype;
        var result = context.apply(obj, args)
        if (typeof result == 'object' || typeof result == 'function') {
            return result;
        }
        return obj
    }
    ```

    1. call 都做了什么
    > 改变this指向

    ```
        function polifyCall() {
            var fn = Array.prototype.slice.call(arguments, 0, 1)[0];
            var context = Array.prototype.slice.call(arguments, 1, 2)[0];
            var args = Array.prototype.slice.call(arguments, 2);

            context.fn = fn;
            var result = context.fn.apply(context, args);

            delete context.fn;

            return result


        }
    ```

###### Object Es6中新增的方法

#

1. set 不会给对象中新增属性

```javascript
var setObj1 = {
     names:[],
     set name (x){
         return this.names.push(x);
     },
    //  get name (){
    //      return this.names
    //  }
 }

 console.log( setObj1.name ) // undefined set不会新增属性信息
```

2. Object.freeze 冻结对象

> 被冻结的对象不能修改属性值，也不能删除属性，也不能修改属性的可读写性可枚举性等信息

```javascript
var setObj1 = {
     names:[],
     age: 20,
     set name (x){
         return this.names.push(x);
     },
     get name (){
         return this.names
     }
 }
 setObj1.name = 'nihao';
 console.log(setObj1.name, setObj1.names);



 var freezeO  = Object.freeze(setObj1);
 freezeO.names= [];

 console.log(freezeO === setObj1);

 freezeO.age = 30;

 console.log(freezeO);   // {names:[nihao], age: 20}  不能修改信息值 不会改变

```


3. Object.seal

> 密封一个对象  可以修改属性值 但是不能删除或者新增属性

