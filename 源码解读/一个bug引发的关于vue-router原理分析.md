# bug描述
当前系统为微前端框架，现在问题现象为：当子应用中添加了`{ path: '*', redirect: 'xxx' }`兜底代码时，再想跳转到非当前子应用路由中时，持续跳转到重定向的路由中，无法跳转到其他子应用或基座路由页面中。

# bug定位

通过debug代码，发现`vue-router`中`popState`监听会执行两次，一次为基座（主应用）中的代码监听，一次为子应用的路由监听。所以去查看了`vue-router`的源码，查看为何会存在这种情况。

# 查看源码
> 当前项目中vue-router版本为 3.1.6

1. 先从install开始，因为我们知道我们在使用vue-router的时候，都是从vue.use(router)开始的。

```javascript
Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        // 如果是root Vue
        this._router = this.$options.router
        this._router.init(this)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
})
```
主要看根节点vue对象中，如果有router对象，那么就会执行router对象中的`init()`。

2. 进入index.js文件中，查看init方法。

```javascript
    app.$once('hook:destroyed', () => {
      // clean out app from this.apps array once destroyed
      const index = this.apps.indexOf(app)
      if (index > -1) this.apps.splice(index, 1)
      // ensure we still have a main app or null if no apps
      // we do not release the router so it can be reused
      if (this.app === app) this.app = this.apps[0] || null
    })

    // main app previously initialized
    // return as we don't need to set up new history listener
    if (this.app) {
      return
    }

    this.app = app

    const history = this.history

    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } 
```
监听了vue实例的destroyed方法，当组件销毁时同时也销毁当前apps中对应记录的组件实例。由于我们使用的模式是`history`模式，下面我们看下`HTML5History`类都做了什么。

3. 进入html5.js文件

```javascript
// constructor
const initLocation = getLocation(this.base)
window.addEventListener('popstate', e => {
    const current = this.current

    // Avoiding first `popstate` event dispatched in some browsers but first
    // history route not updated since async guard at the same time.
    const location = getLocation(this.base)
    if (this.current === START && location === initLocation) {
    return
    }

    this.transitionTo(location, route => {
    if (supportsScroll) {
        handleScroll(router, route, current, true)
    }
    })
})

```
到这里，看出`HTML5History`构造函数中增加对popstate的监听，但是我们在 `2` 中看到其实当前版本没有在app全部销毁时去解除`popstate`的事件监听。至此，也就说明在当前版本中，一旦 `new Router({ mode: 'history' })`之后，则不管后续还有无组件，`popstate`监听就会一直存在，这也是开头bug产生的原因。

4. 因为当前版本比较低，抱着试试看的心态看了看高版本，想着如果该问题没有解决，就去github上提个issue,但是发现高版本此问题已被解决。
> 当前版本 3.4.6
init()

- 下面代码中可以看出，当组件都销毁时，会执行`history.teardown()`方法
- 并且数据监听不再是直接在构造函数中监听，而是单独独立出方法 `setupListeners`

```javascript
app.$once('hook:destroyed', () => {
    // clean out app from this.apps array once destroyed
    const index = this.apps.indexOf(app)
    if (index > -1) this.apps.splice(index, 1)
    // ensure we still have a main app or null if no apps
    // we do not release the router so it can be reused
    if (this.app === app) this.app = this.apps[0] || null

    if (!this.app) this.history.teardown() // 当组件都销毁时，执行teardown
})

if (history instanceof HTML5History || history instanceof HashHistory) {
    const setupListeners = routeOrError => {
        history.setupListeners()
        handleInitialScroll(routeOrError)
    }
    history.transitionTo(
        history.getCurrentLocation(),
        setupListeners,
        setupListeners
    )
}
```

history.teardown函数

```javascript
teardown () {
    this.listeners.forEach(cleanupListener => {
      cleanupListener()
    })
    this.listeners = []
    this.current = START
    this.pending = null
  }
}
```
setupListeners 函数
```javascript
// 方便清除event监听
const handleRoutingEvent = () => {
    const current = this.current

    // Avoiding first `popstate` event dispatched in some browsers but first
    // history route not updated since async guard at the same time.
    const location = getLocation(this.base)
    if (this.current === START && location === this._startLocation) {
    return
    }

    this.transitionTo(location, route => {
    if (supportsScroll) {
        handleScroll(router, route, current, true)
    }
    })
}
window.addEventListener('popstate', handleRoutingEvent)
// 方便后续统一销毁监听
this.listeners.push(() => {
    window.removeEventListener('popstate', handleRoutingEvent)
})
```

# 总结
综上，该问题解决方案为升级vue-router版本，升级到3.4.6以上版本即可解决上述问题。

*下篇将会分享一下全面的vue-router源码解析*




