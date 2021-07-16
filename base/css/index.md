##### position

- sticky（粘性定位）

  > 元素根据正常文档流进行定位，然后相对它的*最近滚动祖先（nearest scrolling ancestor）*和 [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block) (最近块级祖先 nearest block-level ancestor)，包括table-related元素，基于`top`, `right`, `bottom`, 和 `left`的值进行偏移。偏移值不会影响任何其他元素的位置。

  > 该值总是创建一个新的[层叠上下文（stacking context](https://developer.mozilla.org/en/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)）。注意，一个sticky元素会“固定”在离它最近的一个拥有“滚动机制”的祖先上（当该祖先的`overflow` 是 `hidden`, `scroll`, `auto`, 或 `overlay`时），即便这个祖先不是最近的真实可滚动祖先。

  注意事项：

  1. top 值一定要写 不写top值不会发生粘性行为
  2. 如果子元素的高度小于父级滚动元素的高度则不会发证粘性行为

  根据上述两点注意事项，举两个例子

  1. top值没有 不会发生粘性行为

     ```javascript
     html
     <div class="wrap">
         <div class="sticky-div">震惊，12岁女孩5年前竟然7岁</div>
         <p>ddddddddd</p>
         <p>wwwwwwww</p>
         <p>rrrrrrrr</p>
         <p>ddddddddd</p>
         <p>wwwwwwww</p>
         <p>rrrrrrrr</p>
     </div>
     
     css
     
     .wrap{
           height: 50px;
           width: 200px;
           overflow: auto;
           background: greenyellow;
       }
       .sticky-div{
           position: sticky;
           position: -webkit-sticky;
         // 没有指定top值
       }
     
     
     ```

     <img src="/Users/wangkaiyuan/Library/Application Support/typora-user-images/image-20210716164858975.png" alt="image-20210716164858975" style="zoom:50%;" /><img src="/Users/wangkaiyuan/Library/Application Support/typora-user-images/image-20210716164941135.png" alt="image-20210716164941135" style="zoom:50%;" />

     左图是初始状态，右图是滚动状态 没有发生粘性行为  当把top:0加上之后  

     <img src="/Users/wangkaiyuan/Library/Application Support/typora-user-images/image-20210716165110981.png" alt="image-20210716165110981" style="zoom:50%;" /> 发生了粘性行为

  2. Position:sticky 的元素 或者其父元素的高度小于滚动元素的高度 则也不会发生粘性行为

     ```javascript
     html
     <div class="wrap-wrap">
       <div class="wrap">
           <div class="sticky-div">震惊，12岁女孩5年前竟然7岁</div>
           <p>ddddddddd</p>
           <p>wwwwwwww</p>
           <p>rrrrrrrr</p>
           <p>ddddddddd</p>
           <p>wwwwwwww</p>
           <p>rrrrrrrr</p>
       </div>
     </div>
     css
     .wrap-wrap{
         height: 150px;
         overflow: auto;
         background:hotpink;
     }
     .wrap{
         height: 50px; // 当高度固定时不会发生粘性行为 当把固定高度去掉之后 就会发生粘性行为了
         width: 200px;
         margin-top: 200px;
         background: greenyellow;
     }
     .sticky-div{
         position: sticky;
         position: -webkit-sticky;
         top: 0;
     }
     ```

  3. 粘性元素是 想对于最近的父级滚动元素定位

     ```javascript
     html
     <div class="wrap-wrap">
       <div class="wrap">
           <div class="sticky-div">震惊，12岁女孩5年前竟然7岁</div>
           <p>ddddddddd</p>
           <p>wwwwwwww</p>
           <p>rrrrrrrr</p>
           <p>ddddddddd</p>
           <p>wwwwwwww</p>
           <p>rrrrrrrr</p>
       </div>
     </div>
     css
     .wrap-wrap{
         height: 150px;
         overflow: auto;
         background:hotpink;
     }
     .wrap{
         height: 50px;
         width: 200px;
         margin-top: 200px;
         background: greenyellow;
       	overflow: auto;// 这个时候是相对 wrap 元素定位  
     }
     .sticky-div{
         position: sticky;
         position: -webkit-sticky;
         top: 0;
     }
     
     ```

     <img src="/Users/wangkaiyuan/Library/Application Support/typora-user-images/image-20210716165717906.png" alt="image-20210716165717906" style="zoom:50%;" />.wrap 元素 overflow:auto时是这样粘性；.wrap元素去掉height:50px;overflow:auto;<img src="/Users/wangkaiyuan/Library/Application Support/typora-user-images/image-20210716165956653.png" alt="image-20210716165956653" style="zoom:50%;" />

- 兼容性（B端系统不要求兼容性很强的可以用  要求很好兼容性的就不能用这个属性）

  ![image-20210716170112394](/Users/wangkaiyuan/Library/Application Support/typora-user-images/image-20210716170112394.png)

