#### 常见前端排序算法

1. 冒泡排序

```javascript
// 升序排列
function rank1(list) {
   var temp;
   for (var i = 0, len = list.length; i < len; i++) {
       for (var j = i + 1; j < len; j++) {
           if (list[i] > list[j]) {
               temp = list[i];
               list[i] = list[j];
               list[j] = temp;
           }
       }
   }
}
```

2. 插入排序


