- 出口文件
  - **`hash`**: 针对整体项目而言，只要有文件发生变化打出的包的hash地址都会变化 
  - **`chunkhash`**：基于的是每一个 chunk 内容的改变，如果是该 chunk 所属的内容发生了变化，那么只有该 chunk 的输出文件的哈希会发生变化，其它的不会。
  - **`contenthash`**: 顾名思义，该哈希根据的是文件的内容。从这个角度上说，它和`chunkhash`是能够相互代替的。所以在“性能基线”代码中作者使用了`contenthash`。

- Js 文件名hash名在js名字里面和在名字外面有什么区别

  - name.js?hash=898989

    > 理论上给css或js后面加数字什么的没什么用，不会影响文件的调用。但是，如果改变了数字，浏览器就会当成一个新文件读取，而不会读取以前的缓存文件。

    **先部署页面，再部署资源**：在二者部署的时间间隔内，如果有用户访问页面，就会在新的页面结构中加载旧的资源，并且把这个旧版本的资源当做新版本缓存起来，其结果就是：用户访问到了一个样式错乱的页面，除非手动刷新，否则在资源缓存过期之前，页面会一直执行错误。

    **先部署资源，再部署页面**：在部署时间间隔之内，有旧版本资源本地缓存的用户访问网站，由于请求的页面是旧版本的，资源引用没有改变，浏览器将直接使用本地缓存，这种情况下页面展现正常；但没有本地缓存或者缓存过期的用户访问网站，就会出现旧版本页面加载新版本资源的情况，导致页面执行错误，但当页面完成部署，这部分用户再次访问页面又会恢复正常了。

    链接：https://www.zhihu.com/question/20790576/answer/32602154

  - name.898989.js

    > 生成新的js文件

    区别：（覆盖式发布）带问号这种形式的静态文件不会变，还是name.js文件，此时就存在一个问题，如果部署的话是先部署静态文件还是先部署模板，先部署静态文件模板不变的话会加载到新文件导致出问题，如果先部署模板后部署静态文件则会导致文件展示可能出问题； （非覆盖式发布）解决这种情况就是第二种形式 生成一个新文件然后引入，然后先上资源文件，再上模板文件。

    