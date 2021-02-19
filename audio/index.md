##### 1.  ajax请求获取response中的content-length

前提条件：

> 请求是跨域请求

现象：

> 通过 xhr.getResponseHeader('Content-Length')获取该字段时报错

 ```
   Refused to get unsafe header "Content-Length"
 ```


原因：

> 1. W3C的 xhr 标准中做了限制，规定客户端无法获取 response 中的 Set-Cookie、Set-Cookie2这2个字段，无论是同域还是跨域请求；
>
> 2. W3C 的 cors 标准对于跨域请求也做了限制，规定对于跨域请求，客户端允许获取的response header字段只限于“simple response header”和“Access-Control-Expose-Headers” （两个名词的解释见下方）。

>
> 详细解释： [详细说明 form 网络](https://segmentfault.com/a/1190000004322487)


引申： 

> CORS (跨域资源共享)

 定义：

> 跨域资源共享(CORS) 是一种机制，它使用额外的 HTTP 头来告诉浏览器 让运行在一个 origin (domain) 上的Web应用被准许访问来自不同源服务器上的指定的资源
>
> 服务端的相互请求不会出现跨域现象
>

什么情况下需要跨域资源共享：
>   1. 由XMLHttpRequest或者Fetch发起的跨域HTTP请求
> 2. web字体 css中通过@font-face使用跨域字体资源
> 3. webGL贴图
> 4. 使用 drawImage 将 Images/video 画面绘制到 canvas
> 5. 样式表

附带身份凭证的请求：

> Fetch 和 CORS有一个有趣的特征，可以基于HTTP cookies和HTTP认证信息发送身份凭证。 一版而言，对于跨域XMLHttpRequest或Fetch请求，浏览器不会发送身份凭证信息，如果要发送身份凭证信息，需要设置XMLHttpRequest的某个特殊标志位。

```
xhr.withCredentials = true
```
但是如果服务器响应的请求中没有携带 Access-Control-Allow-Credentials: true，浏览器将不会把响应内容返回给请求的发送者。

附带身份凭证的请求与通配符：

> 对于附带身份凭证的请求，服务器不能把Access-Control-Allow-Origin的值设置为*，如果设置成了*，请求将会失败。

HTTP 响应首部字段

> Access-Control-Allow-Origin: <Origin> | *

Origin参数值指向了允许访问该资源的外域url。对于不需要携带身份凭证的请求，服务器可以指定该字段的值为*，表示允许来自所有域的请求

> Access-Control-Expose-Headers

在跨域访问时，XMLHttpRequest对象的getResponseHeader()方法只能拿到一些最基本的响应头，Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma，如果要访问其他头，则需要服务器设置本响应头。

> Access-Control-Expose-Headers让服务器把允许浏览器访问的头放入白名单。
>
> 例如 Access-Control-Expose-Headers : Content-Length
>
> XMLHttpRequest对象就能通过getResponseHeader()获取Content-Length响应头部值。


HTTP 请求首部字段

> 列出了可用于发起跨域请求的首部字段。请注意，这些首部字段无须手动设置。当开发者使用XMLHttpRequest对象发起跨域请求时，他们已经被设置就绪。

> Origin 首部字段表明预检请求或实际请求的源站。
>
> origin 参数的值为源站URL。他不包含任何路径信息，只是服务器名称。
>
> 注意： 不管是否为跨域请求，ORIGIN字段总是被发送。


window.onerror 与跨域的关系

> 如果是window.onerror添加在监听不同域下的代码报错（跨域文本）， 那么onerror函数中不会显示完整的错误信息，语法错误的细节将不会被展示出来取而代之的是'Script error.'
如果想要能显示出详细信息，则必须在服务端设置允许跨域'Access-Control-Allow-Origin:*'response header,还需要在script标签上添加crossorigin 属性



2. ArrayBuffer和Array关于读写速度问题


误区： js中的Array在内存中并不是一块连续的存储区域，而是类似哈希映射的方式存在的，对于读取操作哈希表效率并不高，但是对于修改和删除的操作效率比较高。


AraryBuffer则是内存中的一段连续的存储区域，所以在读取速度上比Array快很多


[详情参考信息1](https://blog.csdn.net/donspeng/article/details/83444861)

[详情参考信息2](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
