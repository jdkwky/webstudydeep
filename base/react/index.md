- Fiber

  -  大量虚拟dom节点diff时可能会阻塞页面的渲染，所以将vDom存储在一份链表中，每个fiber包含当前节点信息，父节点信息，子节点信息及兄弟节点信息；
  - 利用浏览器的 requestIdleCallback （react 中是polify了此函数），该函数当浏览器空闲的时候会去调用Callback中的方法（？浏览器一直不空闲怎么办）
  - 利用上述调度函数去构建fiber链表
  - 但是虚拟节点的渲染并不能在上述调度函数中做，可能fiber链表并没有完全更新完就可能存在只渲染了一部分节点信息，这并不是用户想看到的，所以渲染的过程还是同步的。

- setState 是同步还是异步的

  - 在 钩子函数中  是异步的
  - 在 setTimeout等函数中是 同步的

  原因： react在渲染的时候 会存在事务这个概念，当渲染开始时在钩子函数中setState 会判断是否需要Update,这时不需要更新则将这个组件存起来，当渲染结束事务会统一添加后置处理，标记是否需要Update 的标记会被标记为false，当在异步函数SetTimeout中执行setState时则判断为需要更新，所以此时setState是同步的。



- 基础学习
  - state 中的值不能直接被修改   immutable 
  - State props render 就会发生变化
  - 父组件的render执行 子组件render 也会执行
  - Web Components  、 React Component 是将dom节点用js 节点表示
  - 父子组件通信
    - 父向子组件通信 props context
      - context
        - React 渲染了一个订阅 context组件的对象，这个组件会从组件树中离自身最近的那个匹配的 `Provider` 中读取到当前的 context 值。
    - 子向父组件通信 事件
  - react 高阶组件
  - react 优化方式