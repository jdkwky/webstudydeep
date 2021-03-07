> 编写一个方法，该方法接收两个参数，分别为 k 和 一个无序的纯数字数组。
>
> 该方法在执行后，会返回数组中第 k 大的数字。特别注意，如果数组中，有两位数值一样的数字，同数值数字排名并列。
>
> 如 [3,1,3,2,5,4,5] 中，第 1 大的数字为 5，第2大的数字为 4，第5大的数字为 1。

此题目考察数组点的常用基本方法，解题思路如下：

- 先做数组去重
- 然后做数组内部值的排序
- 返还答案

```javascript
function rank(k, nums){
  const newNums = Array.from(new Set(nums));
  const rankNums = newNums.sort((val1,val2) => val2 - val1);
  return rankNums[k -1];
}
```

##### Array

- Array.from

  > 语法： Array.from(arrayLike[,mapFn[,thisArg]])

  - 参数
    - arrayLike 想要转换成数组的伪数组对象或可迭代对象
    - mapFn | 可选  如果指定了该参数，新数组中的每个元素会执行该回调函数
    - thisArg | 可选  执行回调函数mapFn 时 this 对象
  - 返回值： 返回一个新的浅拷贝数组

  ```javascript
  // 从String 生成数组
  Array.from('foo') // ['f','o','o']
  // 从Set 生成数组
  Array.from(new Set(['foo','bar','baz','foo']))  // ['foo','bar','baz']
  // 在类数组中使用 箭头函数
  Array.from({ length: 5 }, (x, i) => i); // [0,1,2,3,4]
  // 数组合并去重  
  function combine(){
      let arr = [].concat.apply([], arguments);  //没有去重复的新数组
      return Array.from(new Set(arr));
  }
  
  var m = [1,2,2], n = [2,3,3]
  console.log(combine(m,n)) // [1, 2, 3]
  ```

  > 引申： 快速生成 0-9 数字的数组，能想到的尽可能多的方式

  ```javascript
  Array.from(new Array(10).keys()) // [0,...., 9]
  Array.from({ length: 10 }, (x, i) => i) // [0,..., 9]
  Array.from({ length: 10 }).map((x, i) => i) // [0,...,9]
  ```

- Array.isArray : 可以使用 Object.prototype.toString.call(obj)    => [object Type] polify

  > 检测 参数 是否是数组

  - 参数
    - obj 需要检测的值
  - 返回值： 返回 Boolean类型值，标识检测对象是否是数组

  ```javascript
  // 下面的函数调用都返回 true
  Array.isArray([]);
  Array.isArray([1]);
  Array.isArray(new Array());
  Array.isArray(new Array('a', 'b', 'c', 'd'))
  // 鲜为人知的事实：其实 Array.prototype 也是一个数组。
  Array.isArray(Array.prototype);
  
  
  
  // 下面的函数调用都返回 false
  Array.isArray();
  Array.isArray({});
  Array.isArray(null);
  Array.isArray(undefined);
  Array.isArray(17);
  Array.isArray('Array');
  Array.isArray(true);
  Array.isArray(false);
  Array.isArray(new Uint8Array(32))
  Array.isArray({ __proto__: Array.prototype });
  Array.isArray({ 0: 1, length: 1 });
  
  
  
  
  // 注意： 
  Array.prototype instanceof Array   // false
  Array.isArray(Array.prototype)  // true
  
  ```

  > Instanceof 原理

  ```javascript
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

  > typeof 原理

  ```javascript
  根据二进制判断，所以 typeof null 被判断成了对象
  
  - 000：对象
  - 1：整数
  - 010：浮点数
  - 100：字符串
  - 110：布尔
  
  有 2 个值比较特殊：
  
  - undefined：用 - （−2^30）表示。
  - null：对应机器码的 NULL 指针，一般是全零。
  ```

- Array.fill

  > 该方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素 。不包括终止索引

  ```javascript
  var arr = Array(3).fill({}) // [{}, {}, {}];
  arr[0].hi = "hi"; // [{ hi: "hi" }, { hi: "hi" }, { hi: "hi" }]   // 如果fill是引用类型，则填充的是同一个引用
  ```

- Array.find

  > 返回数组中满足提供的测试函数的第一个元素的值。否则返回undefined

  ```javascript
  console.log([{ name: 'test', quantity :3 }].find(val => val.name =='test'));  // { name: 'test', quantity :3  }
  ```

- Array.findIndex  

  > 返回数组中满足提供提供测试函数的第一个元素的索引。若没有找到对应元素返回-1。

- Array.slice  

  > 方法返回一个新的数组对象，这一对象是一个由 begin 和end 决定的原数组的浅拷贝（包括 begin， 不包括end）， 原始数组不会被改变。

  将类数组转换成数组

  ```javascript
  Array.prototype.slice.call(arguments); // 将参数 转换成数组
  
  
  const arrayLike = {0: 'Bob', 1: 'Lucy', 2: 'Daisy', length: 3 };
  [].slice.call(arrayLike);   // ['Bob','Lucy','Daisy']
  ```

  

