window.onload = function () {
    // 存在性   hasOwnProperty 和 in

    var obj = {
        a: 'a'
    }
    var objSub = {};
    objSub.__proto__ = obj;
    objSub.b = 'b';
    console.log(objSub);


    console.log('b' in objSub, 'in b');
    console.log('a' in objSub, 'in a');

    console.log(objSub.hasOwnProperty('a'), 'hasOwnProperty a');
    console.log(objSub.hasOwnProperty('b'), 'hasOwnProperty b');



    // 如何遍历数组 对象

    // for of , for in , for , forEach  的关系

    // for 循环便利数组，类数组结构 不能便利对象
    // forEach  循环便利数组  不能便利对象
    // for of 既能便利数据又能便利对象 val是数组内容
    // for in 同上 val 是数组下标
    // return  只能在函数中使用，并且在forEach中的return并不会真的返回，而是类似continue的功能

    // break continue 不能再forEach中使用，能再for , for in , for of中使用


    // var list = new Array(10000000)
    // var start = +new Date;
    // for (let i = 0, len = list.length; i < len; i++) {
    //     list[i] = 1;
    // }
    // var end = +new Date;
    // console.log(end - start, 'for');
    // var start = +new Date;
    // list.forEach((val) => {
    //     val = 1;
    // });
    // var end = +new Date;
    // console.log(end - start, 'forEach');

    // var start = +new Date;
    // for (let i in list) {
    //     list[i] = 1
    // }
    // var end = +new Date;
    // console.log(end - start, 'for in');

    // var start = +new Date;
    // for (let val of list) {
    //     val = 1;
    // }
    // var end = +new Date;
    // console.log(end - start, 'for of ');

    // Symbol.iterator 遍历对象

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
        console.log(i, ' iterator');

    }

    var obj1 = {}

    Object.defineProperty(obj1, 'a', {
        configurable: true,
        writable: false,
        enumerable: true,
        value: 10
    })

    console.log(obj1.a);
    obj1.a = 20;
    console.log(obj1.a);



    // ？ __proto__ 和 prototype  关系


    var myObject = {
        a: 'a'
    }

    var anotherObject = Object.create(myObject);
    console.log(anotherObject);

    function Father() { }
    function Sun() { }

    Sun.prototype = Object.create(Father)
    var sun = new Sun();
    console.log(sun);


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

    var obj4 = ObjectCreate(Father)
    console.log(obj4);


    // prototype __proto__


    function Father() {
        this.nameList = ['a', 'b', 'c'];
    }

    Father.prototype.sayNames = function () {
        console.log(this.nameList.join(','))
    }

    Father.prototype.pushName = function (name) {
        this.nameList.push(name)
    }
    // //  混合继承
    function Sun() {
        Father.apply(this, arguments)
    }

    Sun.prototype = Father.prototype;


    var sun = new Sun();
    var sun2 = new Sun();
    var father = new Father();
    sun.sayNames();

    sun.pushName('wky')
    sun.sayNames();
    sun2.sayNames()
    father.sayNames();
    father.pushName('wkyFather')
    father.sayNames();



    //  实例继承   缺点：参数对象共享，导致混乱
    // function Sun() { }

    // Sun.prototype = new Father()
    // var sun = new Sun();
    // var father = new Father();
    // var sun1 = new Sun();

    // console.log(sun, sun1);

    // sun.sayNames();

    // sun.pushName('wky')
    // sun.sayNames();   //   wky
    // sun1.sayNames();  // wky  明明没有添加过wky
    // father.sayNames();
    // father.pushName('wkyFather')
    // father.sayNames();


    // new 的过程都做了什么
    // 1. 改变this 指向
    // 2. 增加 __proto__

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

    var sun3 = polifyNew(Sun, '1111');

    console.log(sun3, 'sun3');

    // call 

    function polifyCall() {
        var fn = Array.prototype.slice.call(arguments, 0, 1)[0];
        var context = Array.prototype.slice.call(arguments, 1, 2)[0];
        var args = Array.prototype.slice.call(arguments, 2);

        context.fn = fn;
        var result = context.fn.apply(context, args);

        delete context.fn;

        return result


    }

    // Object
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

    console.log(freezeO);


}