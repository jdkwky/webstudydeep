#### Array

1. sort 
   
> 方法默认是按''排序 如果数据里是数组，也会将数字转换成字符串进行排序

    扩展知识  V8 sort 排序： 数据量少的时候是用插入排序算法，数据量大的时候是用的快排算法

2. 操作方法

   - concat 
    ```
        var list1 = [1, 3, 4];
        var concatList = list1.concat([4, 5, 6]).concat([[8, 9, 10]]);
        // 返回数组
        console.log(concatList); [1,3,4,4,5,6,[8,9,10]]

    ```
   - slice 数组截取方法  
     - 返回截取后的数组 startIndex endIndex endIndex不包含
     - 如果endIndex 为负数，则截取的是 倒数第几个数 当然也不包含endIndex的索引值
    ```
        const sliceList = concatList.slice(0, 4);
     console.log(sliceList);   [1,3,4,4]
    ```
   
    - splice 方法  删除 插入 替换  返回删除的数组 ，如果没有删除，则返回一个空数组
    ```
        删除
        startIndex deleteItems (从哪里开始删除，删除多少项数据)
     插入
        startIndex, deleteItems, insertObj (从哪里开始插入，0，要插入的数据)
   
        替换
        startIndex, deleteItems, repleaceObjs(从哪里开始替换，替换几项，替换的项)
    ```
3. 位置方法

    - indexOf  从数组的开头开始查找
    - lastIndexOf  从数组的结尾开始查找
    ```
        接收两个参数: value, index : 要查找的value值和查找起点位置的索引 , value值是=== 才会返回
        // indexOf
        const index = concatList.indexOf('4'); concatList.indexOf(4);   
        console.log(index);  // -1    2 

        const lastIndex = concatList.lastIndexOf(4)
        console.log(lastIndex);  // 4

    ```
4. 迭代方法
    - every
    - filter
    - forEach
    - map
    - some
    ```
        params: function(value, index, array), this
    ```
5. 归并方法
    - reduce 从数组的开头开始归并
    - reduceRight  从数组的结尾开始归并

    ```
        params: function(result, nextValue, index, array),  initValue（数组为空时必须付初始值，不然会报错）
        var reduceList = [];

        var sum = reduceList.reduce((val, nextVal) => {
            return val + nextVal;
        }, 0)   // 必须给最初的初始值
        console.log(sum);  // 0
    ```

