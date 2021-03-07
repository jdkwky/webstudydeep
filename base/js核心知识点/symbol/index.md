###### 1. Symbol 是基本数据类型
> Symbol 是基础数据类型之一  typeof Symbol() 返回symbol

###### 2. Symbol 不支持构造函数方式
> new Symbol() 会报错

###### 3. Symbol 使用方法

> Symbol 会生成一个唯一的标识（不会重复）

```javascript
var symbol1 = Symbol('aa');
var symbol2 = Symbol('bb');
symbol1 == symbol2  // 输出 false
```

###### 4. Symbol 函数 for 和 keyFor

> for函数生成唯一的Symbol数据, keyFor返回Symbol数据类型的key值
```javascript
    Symbol.for('eeee'); // Symbol(eeee)
    Symbol.keyFor(Symbol.for('eee')) // 返回eee
```

###### 5. 具体使用场景

```javascript
var obj11 ={
    name:'zhangsan'
}
var obj21 = {
    name:'李四'
}

var obj31 = Object.assign(obj11, obj21);
console.log(obj31);
// 其中一个名字被融合没了

// 具体使用场景
var obj1 ={
    [Symbol('name')]:'zhangsan'
}
var obj2 = {
    [Symbol('name')]:'李四'
}

var obj3 = Object.assign(obj1, obj2);

console.log(obj3,'obj3');
//  不会被融合

```

###### 6.模拟实现Symbol类型

```javascript

 (function(){  
    var getOVFnName = (function(){
        let index = 0;
        return function(desc) {
            index = index +1;
            return index + '-' + desc;
        }
    })();
    
    function SymbolPolify (desc){

        var symbol = Object.create({
            toString(){
                return this.__name__
            } 
        })
        Object.defineProperty(symbol, '__name__', {
            value: getOVFnName(desc)
        });
        return symbol;
    }
    
    var d = SymbolPolify('dddd');
    var a = SymbolPolify('aaaaa');
    console.log(d, 'd');
    console.log(a, 'a');

})()

```

