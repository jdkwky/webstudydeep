#### 对象和原型

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

2. 