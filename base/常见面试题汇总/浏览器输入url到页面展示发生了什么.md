##### 1. 从浏览器输入url到页面展现到底发生了什么

- 只能匹配url： 浏览器可能会从本地书签或者历史记录中匹配当前输入的url

  > Url 到底是啥： scheme://host.domain:port/path/filename
  >
  > - scheme - 定义因特网服务的类型。常见的协议有 http、https、ftp、file，其中最常见的类型是 http，而 https 则是进行加密的网络传输。
  > - host - 定义域主机（http 的默认主机是 www）
  > - domain - 定义因特网**域名**，比如 w3school.com.cn
  > - port - 定义主机上的端口号（http 的默认端口号是 80）
  > - path - 定义服务器上的路径（如果省略，则文档必须位于网站的根目录中）。
  > - filename - 定义文档/资源的名称

- IP地址解析

  - 首先查找浏览器缓存，如果浏览器dns缓存存在，则返回相应Ip地址；

  - 操作系统缓存，host文件：如果在操作系统缓存或者host配置文件中查找到域名地址，则返回相应IP地址；

  - 路由缓存

  - ISP 的 DNS 服务器：ISP 是互联网服务提供商(Internet Service Provider)的简称，ISP 有专门的 DNS 服务器应对 DNS 查询请求。

  - 根服务器：ISP 的 DNS 服务器还找不到的话，它就会向根服务器发出请求，进行递归查询（DNS 服务器先问根域名服务器.com 域名服务器的 IP 地址，然后再问.baidu 域名服务器，依次类推）或者迭代查询

    > 什么是DNS： 域名系统，存储域名和IP地址相互对应的分布式数据库（Domain Name Server）
    >
    > DNS 查询方式： 递归查询或迭代查询
    >
    > - 递归查询： 由根域名服务器查询一级域名服务器地址，然后再查询二级域名服务器地址依次类推，直到查到最后的ip然后返回给客户端。
    > - 迭代查询：根域名服务器查询一级域名服务器地址返回给客户端，由客户端发送请求去一级域名服务器查询，一级域名服务器再讲二级域名服务器地址发送给客户端，依次类推，最后将查询到的ip地址返回给客户端。

- http 请求三个阶段： TCP 三次握手、http请求相应信息、关闭TCP链接

  - TCP 三次挥手（发送数据请求之前）
    - 客户端向服务器发送  一个带 SYN=1 ， seq = X的数据包，（第一次握手由浏览器发起告诉服务器我准备发送请求了~）
    - 服务器回一个 SYN=1， ACK = X +1 , seq = Y的数据包（第二次握手 服务器告诉浏览器我准备好了，你快发送吧）
    - 客户端 再发送一个 ACK = Y+1, seq = Z 的数据包 （第三次握手 客户端发送  告诉服务器端 我马上就发送了 你准备接受吧）

  - get post 区别

  - Http 请求相应信息

    - 缓存相关

      - 强缓存   Expries、cache-control

        - Cache-control 请求指令

          - max-age
          - Max-stale
          - Min-fresh
          - No-cache
          - No-store
          - no-transform
          - only-if-cached

        - 缓存响应指令

          - must-revalidate
          - no-cache
            - 在发布缓存副本之前，强制要求缓存把请求提交给原始服务器进行验证。
          - No-store
            - 缓存不应该存储有关客户端请求或者服务器响应的任何内容，即不使用任何缓存。
          - No-transform
          - public 
            - 响应可以被任务对象缓存（发送请求的客户端，代理服务器等）
          - private
            - 只能被单个用户缓存，不能作为共享缓存（代理服务器不能缓存它）。私有缓存可以缓存响应内容。
          - Proxy-revalidate
          - Max-age
          - S-maxage

          

      - 协商缓存

        - Etag    If-no-match   资源变化会导致etag变化 （优先级更高）
        - Last-Modified    If-modified-since  文件被修改的日期

      - 状态码相关

        - `200`：强缓Expires/Cache-Control存失效时，返回新的资源文件

        - `200(from cache)`: 强缓Expires/Cache-Control两者都存在，未过期，Cache-Control优先Expires时，浏览器从本地获取资源成功

          - From memory cache 和from disk cache  前者是内存缓存后者磁盘缓存，内存缓存快，磁盘缓存慢

        - `304(Not Modified )`：协商缓存Last-modified/Etag没有过期时，服务端返回状态码304

          

  - 关闭TCP链接

    - **发起方向被动方发送报文，Fin、Ack、Seq，表示已经没有数据传输了。并进入 FIN_WAIT_1 状态**。(第一次挥手：由浏览器发起的，发送给服务器，我请求报文发送完了，你准备关闭吧)
    - **被动方发送报文，Ack、Seq，表示同意关闭请求。此时主机发起方进入 FIN_WAIT_2 状态**。(第二次挥手：由服务器发起的，告诉浏览器，我请求报文接受完了，我准备关闭了，你也准备吧)
    - **被动方向发起方发送报文段，Fin、Ack、Seq，请求关闭连接。并进入 LAST_ACK 状态**。(第三次挥手：由服务器发起，告诉浏览器，我响应报文发送完了，你准备关闭吧)
    - **发起方向被动方发送报文段，Ack、Seq。然后进入等待 TIME_WAIT 状态。被动方收到发起方的报文段以后关闭连接。发起方等待一定时间未收到回复，则正常关闭**。(第四次挥手：由浏览器发起，告诉服务器，我响应报文接受完了，我准备关闭了，你也准备吧)

-  浏览器解析 渲染页面

  - html Dom tree

  - css Dom tree

  - 绘制页面

    - 重绘：某个元素的背景颜色，文字颜色等，不影响元素周围或内部布局的属性，将只会引起浏览器的重绘。

    - 回流（重排）：某个元素的尺寸发生了变化，则需重新计算渲染树，重新渲染。（更加耗费性能，所以有触发回流操作的尽量合并）

      > ##### 回流(重排)何时发生
      >
      > 下属情况会发生重排：
      >
      > - 添加或删除可见dom元素
      > - 元素位置改变
      > - 元素尺寸改变（包括：外边距、内边距、边框厚度、宽度、高度等属性改变）
      > - 内容改变 例如： 内容改变或者图片被另一个不同尺寸的图片代替
      > - 页面渲染器初始化
      > - 浏览器窗口尺寸改变
      >
      > ##### 渲染树变化的排队与刷新
      >
      > 由于每次重排都会产生计算消耗，大多数浏览器通过队列化修改并批量执行来优化重排过程。然而你可能会强制刷新队列并要求计划任务立刻执行。获取布局信息的操作会导致队列刷新，比如如下方法：
      >
      > - offsetTop,offsetLeft,offsetWitdh,offsetHeight
      > - scrollTop,scrollLeft,scrollLeft,scrollHeight
      > - clientTop,clientLeft,clientWidth,clientHeight
      > - getComputedStyle() (currentStyle in IE)