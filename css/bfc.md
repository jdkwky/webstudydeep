#### 浮动

> float: left rirht none


特点: 

    1.  浮动会使节点脱离文档流，但是并不会使节点消失，节点会继续占位
   
    2. 会使父元素节点高度塌陷

解决方案:
    1. 清除浮动
    2. 触发bfc

1. 清除浮动

    方法: 
   ```
        <!-- 添加空节点 -->
        <div style="clear:both"></div>

        <!-- 伪类:after -->
        <div class="wrap">

            <div class="left">llllllllllllll</div>
            <div class="right">rrrrrrrrrrrrr</div>
            
        </div>

        <style>
            body,
            html {
                margin: 0;
                padding: 0;
            }

            .wrap {
                background: #e5e5e5;
                zoom: 1;  // IE 下触发haslayout
                /* overflow: hidden; */
            }
            .wrap::after {
                clear: both;
                content: '';
                display: block;
            }

            .left {
                background: pink;
                height: 100px;
                width: 100px;
                float: left;
                opacity: 0.4;
                /* margin: 10px; */
            }

            .right {
                background: green;
                height: 50px;
                width: 200px;
                /* margin: 10px; */
                /* overflow: hidden; */
            }
        </style>
   ```
2. 触发bfc

    ```
        <style>
            .wrap{
                overflow: hidden;
            }
        </style>
    ```


#### BFC 
> BFC 块级格式上下文(block formatting context)  

> BFC创建法：
 1.  根元素或其它包含它的元素
 2.  浮动 (float)
 3.  绝对定位元素 (position: absolute)
 4.  行内块 (inline-block)
 5.  表格单元格 (table)
 6.  弹性盒 （flex）


#### margin 折叠

> 相邻的margin可能会被折叠成一个
> 什么叫做垂直毗连的margin （满足三个之一）

1. 父元素的top margin和第一个子元素 top margin
2. 父元素的bottom margin 和最后一个子元素的bottom margin
3. 元素的bottom margin 与这个元素相邻的 top margin
4. 如果一个元素，它没有生成 BFC、没有包含正常流的子元素、min-height是0、height是0或者 auto，则它的 top margin 和 bottom margin 也是垂直毗连的

> 什么叫做相邻的margin （满足以下三个条件）

1. 这两个margin是垂直毗连的
2. margin的两个元素都是正常流的块级元素，并且在同一个bfc中
3. 两个 margin 之间没有行盒（line box）、清除浮动后的空隙（clearance）、padding和 border


```
<style>
     body,
     html {
         margin: 0;
         padding: 0;
     }

     .wrap {
         background: #e5e5e5;
         /* zoom: 1;
         overflow: hidden; */
     }
     .left {
         background: pink;
         height: 100px;
         width: 100px;
         /* float: left; */
         opacity: 0.4;
         margin-top: 10px;
     }

     .right {
         background: green;
         height: 50px;
         width: 200px;
         /* margin-top: 20px; */
         overflow: hidden;
     }

     .clear {
         clear: both;
     }
</style>

<!-- 1. warp top margin 和left 的 top margin -->

<div class="wrap">
  <div class="left">llllllllllllll</div>
  <div class="right">rrrrrrrrrrrrr</div>
</div>
<!-- 导致margin叠加 wrap也会出现margin -->
```

margin叠加规则：

并不是所有的margin都会发生叠加，需要满足如下需求：
1. 垂直相邻的margin才有可能折叠，水平margin永远不折叠
2. 根元素的margin永远不折叠
3. 如果一个元素，它的 top margin 和 bottom margin 是相邻的，并且有清除浮动后的空隙（clearance），这个元素的 margin 可以跟兄弟元素的 margin 折叠，但是折叠后的 margin 不能跟父元素的 bottom margin 折叠。

折叠后的margin大小：
1. 如果margin都是正数，当取最大值，
2. 如果margin有负数， 当取最大值加上最小的负数（如果最大的margin是20px 最小的margin是-20px 则他们计算后的值是0）
3. 如果margin中都是负数，则取最小的


    



