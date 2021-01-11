#### A 页面打开 B 页面

1. 通过window.open打开新页面

```javascript
// A 页面 点开B 页面

window.open('./b.html');

// B 页面

window.opener 会保存 A页面的 window 对象


```

2. 通过A标签打开页面

```javascript
<a href="./b.html">

// B 页面

window.opener 会保存 A页面的 window 对象

```

> 但是上述两种方式打开新页面都会存在一个潜在的漏洞，就是window.opener会保存前一个页面的window对象，解决这个问题 a标签可以添加个属性  `rel = noopener`;window.open这个可以用  newWindow.opener = null;解决这个风险


3. 如何判断 B 页面加载失败

- 正常关闭 通过监听onbeforeunload可以检测到
  ```javascript
    window.onbeforeunload = function(){
          console.log('unload success');
      }
  ```
- 非正常关闭 网页崩溃 不能用这种方式
    - 可以参考  service Worker 方式，采用心跳的方式探活
    - service worker 是异步的 ， 比页面的存活周期要更长一些
    - 页面load时将定时发送心跳，随时更新页面存活的时间戳
    - 如果时间戳时间跟当前时间间隔超过阈值 认为当前页面 crash
    - 监听onbeforeunload函数当页面正常关闭时 则不再监听当前页面的心跳
