> this是在运行时绑定的，并不是在编写时绑定的，它的上下文取决于函数的调用时的各种条件。this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式

- 默认绑定

```javascript
function testThis(){
    console.log(this.a);
}
var a = "test this";
testThis();  // 输出 test this
```
- 隐式绑定

```javascript
var obj = {
    a:'test obj this',
    testThis:function(){
        console.log(this.a);
    }
}

var a = "test this";
obj.testThis();   // => test obj this

<!--attiton 隐式绑定this丢失-->

var testObjThisFun = obj.testThis;
testObjThisFun(); // =>test this  默认绑定规则

```
- 显示绑定

```javascript
function testThis(){
    console.log(this.a);
}

var obj1= {
    a:'hello obj1 this'
}
var obj2= {
    a:'hello obj2 this'
}
testThis.call(obj1); // =>hello obj1 this
testThis.call(obj2); // =>hello obj2 this


```

- new 绑定
```javascript
function TestThis(a){
    this.a = a;
    console.log(this.a);
}
var a = 'test this';
var obj = new TestThis('test obj this');
console.log(obj.a); // test obj this  new绑定this

```

> 优先级
 1. new 绑定
 2. 显示绑定
 3. 隐式绑定
 4. 默认绑定

> 特例 ES6箭头函数

> this 词法

箭头函数不使用this的四种规则，而是根据外层(函数或全局)作用域来决定this

```javascript
function foo(){
    return a=>{
        console.log(this.a); // this 继承自foo
    }
}
var obj1={
    a:"obj1"
}
var obj2={
    a:"obj2"
}
var test1= foo.call(obj1);
test1.call(obj2); // => obj1

```

 

- 手写 call apply

  ```javascript
  Function.prototype.myCall = function(context , ...args){
      const fn = this;
      if(context){
          context.fn = fn;
          const result = context.fn(...args);
          delete context.fn;
          return result;
      }else{
          return fn(...args)
      }
  
  };
  
  Function.prototype.myApply = function(context, args){
      const fn = this;
      if(context){
          context.fn = fn;
          const result = context.fn(...args);
          delete context.fn;
          return result;
      }else{
          return fn(...args)
      }
  }
  ```

  

- 手写bind

  ```javascript
  Function.prototype.myBind = function(){
      const params = [...arguments];
      const context = params.slice(0,1)[0];
      const args = params.slice(1);
      const fn = this;
      return function Fn(){
          const newArgs = args.concat([...arguments]);
          return  this instanceof Fn ? new fn(...arguments) :  fn.apply( context, newArgs);
      }
  }
  ```

- 箭头函数

  > 箭头函数作用域是词法的，函数写在哪里，this指向就指向父级作用域。

  首先先对比一下箭头函数与普通函数的样子：

  ```
  normal function 
  
  function sum (a, b){
      return a + b ;
  }
  
  arrow function 
  var  sum =(a, b) => a + b;
  ```

  > 箭头函数总是函数表达式，并不存在函数声明

  - 箭头函数中的this

    箭头函数存在词法this,词法arguments(他们没有自己的arguments数组，而是继承自父级), 词法super和new.target。

  1. 什么是词法，词法作用域
  >  大部分编译器第一个阶段叫做‘词法化’，‘词法化’的过程会对源代码中的字符进行检查，如果是有状态的解析过程还会赋予单词语义。
  >  词法作用域就是定义在词法阶段的作用域。换句话说，词法作用域是由你写代码时将变量和块作用域写在哪里决定的。

  2. 词法this

  ```javascript
  
  var obj = {
      a : 'obj a ',
      sayThis: function(){
          console.log(this, this.a)
      },
      sayThis1: ()=>{
          console.log(this, this.a);
      }
  }
  var a = 'global a ';
  
  var obj1 = {
      a : 'obj1 a '
  }
  
  obj.sayThis() ; // {a: "obj a ", sayThis: ƒ, sayThis1: ƒ} "obj a "
  obj.sayThis1(); //  window "global a "
  obj.sayThis.call(null); // window "global a" 
  obj.sayThis.call(obj1); // obj1 'obj1 a'
  obj.sayThis1.call(obj1); // window 'global a'
  obj.sayThis1.bind(obj1)() // window 'global a'
  
  ```

  > 由此可见，箭头函数的this是词法的，不会动态改变，即便是使用call，bind或者apply 去绑定this值， 也不会改变箭头函数最初的this指向。
  ```javascript
  
  function Arrow4(){
  	this.name = 'hello arrow4'
      this.sayHello5= function (){
          console.log(this.name ,'sayHello5');
      }
      this.sayHello6 = () =>{
          console.log(this.name ,'sayHello6');
      }
  }
  
  
  
  Arrow4.prototype.sayHello = function(str){
  
  	console.log(this.name, 'hello wrap ', str)
  
  	function test(){
  		console.log(this.name, 'arrow4 Hello test', str);
  	}
  
  	test();
  
  }
  
  Arrow4.prototype.sayHello2 = function(str){
  	
  	console.log(this.name , ' hello2 wrap ', str);
  
  	var test = () =>{
  		console.log(this.name, 'arrow4 Hello test', str);
  	}
  
  	test();
  
  }
  
  Arrow4.prototype.sayHello3 = ()=>{
      console.log(this.name, '======>arrow function')
  }
  
  const a4 = new Arrow4()
  
  a4.sayHello('normal') // hello arrow4 hello wrap  normal // arrow4 Hello test normal
  a4.sayHello2('normal')// hello arrow4  hello2 wrap  normal  // hello arrow4 arrow4 Hello test normal
  a4.sayHello.call({ name: 'obj hello arrow4' }, 'obj') // obj hello arrow4 hello wrap  obj   // arrow4 Hello test obj
  a4.sayHello2.call({ name:'obj hello arrow4 2' }, 'obj2') // obj hello arrow4 2  hello2 wrap  obj2  //  obj hello arrow4 2 arrow4 Hello test obj2
  a4.sayHello5('normal'); // hello arrow4 sayHello5
  a4.sayHello6('normal'); // hello arrow4 sayHello6
  a4.sayHello5.call({ name: 'obj hello arrow4' }); // obj hello arrow4 sayHello5
  a4.sayHello6({ name: 'obj hello arrow4' }); // hello arrow4 sayHello6
  
  
  console.log('===========================');
  console.log('===========================');
  
  
  a4.sayHello3(); // ======>arrow function
  a4.sayHello3.call({ name:'arrow function' }) // ======>arrow function
  
  
  
  
  console.log('===========================');
  console.log('===========================');
  
  
  class Arrow{
      constructor(){
          this.name = 'arrow'
      }
      sayHello(){
          console.log(this.name, "====> sayHello");
      }
  
      sayArrowHello = ()=>{
          console.log(this.name, "====> sayArrowHello");
      }
  }
  
  a.sayHello(); // arrow ====> sayHello
  a.sayArrowHello();  // arrow ====> sayArrowHello
  
  a.sayHello.call({ name:'obj Arrow' }); // obj Arrow ====> sayHello
  
  a.sayArrowHello.call({ name:'obj Arrow' }); // arrow ====> sayArrowHello
  
  const a1 = new Arrow();
  
  console.log(a.sayHello === a1.sayHello); // true
  console.log(a.sayArrowHello === a1.sayArrowHello);  // false
  
  ```

  > 注意： 箭头函数并没有被挂载到prototype上，但是类里的除了箭头函数的其他函数被挂载到了原型链上，箭头函数则被挂载在了每个实例上。因为箭头函数本身是声明式函数，是将函数赋值给了变量，所以函数不会被挂载到原型上。