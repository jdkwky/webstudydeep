###### 请求频繁发送 请求结果交叉返回

# 

###### 1. 解决方案
 - axios cancelToken
  
  ```javascript
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    axios.get('/user/12345', {
    cancelToken: source.token
    }).catch(function(thrown) {
    if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
    } else {
        // 处理错误
    }
    });

    axios.post('/user/12345', {
    name: 'new name'
    }, {
    cancelToken: source.token
    })

    // 取消请求（message 参数是可选的）
    source.cancel('Operation canceled by the user.');
  ```

###### 2. axios 是如何实现xhr请求撤回操作的

> XMLHttpRequest对象是支持抛弃请求的

```javascript
const xhr = new XMLHttpRequest();
xhr.open('get','/server');
xhr.send();

xhr.onabort = function(err){
    console.log(err, 'abort'); // 当请求被abort时 此函数会被调用
}
xhr.abort();
```


> axios 是如何实现的


CancelToken.js 文件
```javascript

// 存储一个promise对象
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}


CancelToken.source = function source() {
  var cancel;

//   token  =  CancelToken对象 包含promise对象
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel  // 可以取消的函数
  };
};

```
xhr.js文件


```javascript

if (config.cancelToken) { // request请求存在cancelToken参数  
  // Handle cancellation
  config.cancelToken.promise.then(function onCanceled(cancel) {
    if (!request) {
      return;
    }
    // 调用xhr的abort方法
    request.abort();
    reject(cancel);
    // Clean up request
    request = null;
  });
}

```



###### 3. fetch 是如何撤销请求的

```javascript
// 增加了如下几行
const controller = new AbortController();
const signal = controller.signal;
console.log(signal, 'signal的初始状态');
signal.addEventListener('abort', function (e) {
    console.log(signal, 'signal的中断状态');
});

setTimeout(function() {
    controller.abort();
}, 2000);
// 增加部分结束

fetch('/api', {signal})
.then((res) => {
    console.log(res, '请求成功');
});
```

###### 4. 如果是用fetch发送请求 怎么解决频繁请求数据不一致问题

> fetch取消请求还不成熟，如果想解决上述问题 建议从返回数据入手，每次发送请求有个唯一值，返回数据的唯一值要和当前存储的唯一值一致 ，不一致就默认将数据舍弃



