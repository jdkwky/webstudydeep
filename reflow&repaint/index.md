#### 回流和重绘

1. 什么叫回流
> html 或css 中部分或者全部元素的尺寸、结构或者某些属性发生改变时，浏览器重新渲染部分或者全部文档的过程就称为回流。
> 
> 会导致回流的操作：
> - 页面首次渲染
> - 浏览器窗口大小发生改变
> - 元素尺寸或者位置发生变化
> - 元素内容发生变化（文字数量图片大小等）
> - 元素字体大小变化
> - 添加或删除可见的dom元素
> - 激活css伪类（如： :hover）
> - 查询某些属性或者调用某些方法
>
> 会导致回流的属性和方法（常用的）：
> - clientWidth,clientHeight,clientTop,clientLeft
> - offsetWidth, offsetHeight,offsetTop,offsetLeft
> - scrollWidth,scrollHeight,scrollTop, scrollLeft
> - scrollIntoView(),scrollIntoViewIfNeeded()
> - getComputedStyle()
> - getBoundingClientRect()
> - scrollTo()

2. 什么叫重绘

> 当页面中元素样式的改变并不影响他在文档流中的位置时如（例如：color,background-color,visibility等）， 浏览器会将新样式赋予给元素并重新绘制它， 这个过程称为重绘。

3. 性能影响
    回流比重绘的代价要更高


参考文档： https://www.cnblogs.com/qcloud1001/p/10265985.html