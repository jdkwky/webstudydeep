- #### 1. proxy特性

  > target handler，以其中handler.set为例

  - 劫持对象
   1. 无中生有能监听到
  ```javascript
  const validator = {
     set: function(obj, prop, value) {
          console.log(' in set catch');
          return Reflect.set(obj, prop, value);
      }
  };
  
  const obj = new Proxy({}, validator);
  obj.a = 'a';  // 输出  ’in set catch‘
  ```
  2. 对象里的对象监听不到
  ```javascript
  const validator = {
      set: function(obj, prop, value) {
          console.log(' in set catch');
          return Reflect.set(obj, prop, value);
      },
    	get: function(obj, prop, value){
        console.log('in get catch')
        return Reflect.get(obj,prop,value)
      }
  };
  
  const obj = new Proxy({}, validator);
  obj.a = { a: 'name' };  // // 输出  ’in set catch‘
  obj.a.a = 'test';  // 输出 in get catch
  ```

  - 监听数组
  1. 数组下标的更改能监听到
  ```javascript
  const validator = {
      set: function(obj, prop, value) {
           console.log(' in set catch list');
           return Reflect.set(obj, prop, value);
      }
  };
  
  const list = new Proxy([], validator);
  list[0] = 'aaa';  // in set catch list
  ```

  2. 数组里的对象更改监听不到

  ```javascript
  const validator = {
      set: function(obj, prop, value) {
          console.log(' in set catch list');
          return Reflect.set(obj, prop, value);
      }
  };
  
  const list = new Proxy([], validator);
  list[0] = { name: 'aaa' }; // 有输出
  list[0].name = 'wky';  // 无输出
  ```

  3. 对数据进行操作

  > push、pop、unshift、shift 都会触发set劫持

  ```javascript
  const validator = {
      set: function(obj, prop, value) {
          console.log(' in set catch list', obj);
          return Reflect.set(obj, prop, value);
      }
  };
  
  const list = new Proxy([], validator);
  // list.push(0);
  list.unshift(1);
  list.shift();
  ```

- object.defineProperty

  ```javascript
  function defineProperty(info, key){
      let val = info[key];
      Object.defineProperty(info, key, {
          get () {
              console.log('get', val);
              return val;
          },
          set (value) {
              val = value;
              console.log('set', val);
          }
      });
  }
  
  
  const list = [1];
  defineProperty(list,'0'); // 监听数组下标
  list[0] = 2; // set 2 能触发
  
  
  defineProperty(info, 'key');
  info.key= '11'; // set 11
  
  info.test ='test'; // 什么都不触发  无中生有 不会触发set 
  ```

  vue2中为什么检测不到数组的 变化，如何解决？

  > 为了性能方面的考虑， 没有通过Object.property进行数组的劫持。如果是想通过数组下标改变数据进而改动视图，需要使用$set 方法

  