  - 双重循环暴力查找最大值
  - 用当前天值减去当前天之前的最小值即可获取最大利润
  ```javascript
  function maxpro(list = []) {
      let min = list[0];
      let max = 0;
      for (let i = 1, len = list.length; i < len; i++) {
          const value = list[i];
          if (value > min) {
              max = max > value - min ? max : value - min;
          } else {
              min = value;
          }
      }
      return max;
  }
  console.log(maxpro([7, 1, 5, 3, 6, 4])); // 5
  ```