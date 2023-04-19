# 全面解析vue-router中你疑惑的点

> vue-router版本为2.0的最后一个版本 v3.6.5版本

我们可能都知道vue-router的一个大概实现原理，就是监听了浏览器的pushState/replaceState事件，但是更详细的技术细节可能大部分人都不是很清楚，你有下面几个疑问点么：
1. 组件如何对应路由渲染的？
2. 路由的守卫钩子是如何执行的？
3. 是如何监`pushState/replaceState`事件的，又是何时解除监听的？
4. `beforeRouteEnter`为什么拿不到当前组件实例，拿不到实例又想使用应该如何做？
5. 同为组件内路由守卫的`beforeRouteUpdate、beforeRouteLeave`又是如何获取到组件实例的？
如果您对这些问题不甚清楚，那么请接着阅读下文，下面将逐一介绍上述问题。

## 路由组件是如何渲染的
要理清这个问题，我们要先从`install`入手，看看当我们`Vue.use(vueRouter)`的时候，vue-router都做了什么。

```js
export let _Vue

export function install (Vue) {
    // 记录install,防止重复install,确保只install一次
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined
    // 给路由注册vm实例
  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  Vue.mixin({
    // mixin混入
    // 每个组件内部都增加beforeCreate钩子
    beforeCreate () {
        // 如果是根节点，存在router实例
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        // 调用router的init方法
        this._router.init(this)
        // 将 _route标记为响应式数据，对应为history.current即为当前路由的信息
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 如果是非跟节点，则找到根节点对应的实例
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })
  // 代理$router指向vue-router的一个实例 
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
  // 代理$route 指向当前路由信息
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })
  // 注册全局组件  router-view router-link
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)
}
```
上述install主要代码我都加了注释，我们可以看出install主要做了三件事：
1. 防止重复install标记
2. 全局混入beforeCreate钩子，在钩子对router执行init函数，然后在路由中注册当前vm实例；在destroyed钩子中销毁已注册的实例。
3. 在Vue的原型链中代理了两个属性，$router指向vue-router的实例，$route指向的是当前路由的信息。
4. 注册两个路由相关的全局组件`router-view/router-link`组件。

至此，我们看到了熟悉的路由组件`router-view`。下面大致说下`router-view`组件实现的流程：
1. 该组件是个`functional`组件，组件内部没有状态，性能好，组件内部没有this。
2. 组件内部根据`parent.$route`路由状态进行组件的匹配和渲染。
3. 计算路由深度。
4. 如果是缓存组件（keep-alive），则缓存当前组件。
5. 给data上增加`registerRouteInstance`方法。
6. 渲染当前路由匹配到的组件信息。

至此，完成对应路由的组件的渲染。

## 路由的守卫钩子是如何执行的

执行路由守卫的核心就是下面这段代码：

```js
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
```
和node的中间件原理类似，层层递进去执行守卫。

先执行的第一层守卫
```js

const queue: Array<?NavigationGuard> = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated), // beforeRouteLeave
    // global before hooks
    this.router.beforeHooks, // beforeEach
    // in-component update hooks
    extractUpdateHooks(updated), // beforeRouteUpdate
    // in-config enter guards
    activated.map(m => m.beforeEnter), // beforeEnter
    // async components
    resolveAsyncComponents(activated) 
)
```
在执行第二层
```js
const enterGuards = extractEnterGuards(activated) // beforeRouteEnter
const queue = enterGuards.concat(this.router.resolveHooks) // beforeResolve
```
最后执行afterEach守卫钩子。

同时给大家解释下4、5问题，为什么 `beforeRouteEnter`获取不到当前的组件实例，但是`beforeRouteUpdate、beforeRouteLeave`这两个钩子能获取到呢？

### `beforeRouteEnter`获取不到当前的组件实例问题

从上述`extractEnterGuards(activated)`这里入手

```js
function extractEnterGuards (
  activated: Array<RouteRecord>
): Array<?Function> {
  return extractGuards(
    activated,
    'beforeRouteEnter',
    (guard, _, match, key) => {
      return bindEnterGuard(guard, match, key)
    }
  )
}
function extractGuards (
  records: Array<RouteRecord>,
  name: string,
  bind: Function,
  reverse?: boolean
): Array<?Function> {
  const guards = flatMapComponents(records, (def, instance, match, key) => {
    const guard = extractGuard(def, name)
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(guard => bind(guard, instance, match, key))
        : bind(guard, instance, match, key)
    }
  })
  return flatten(reverse ? guards.reverse() : guards)
}

export function flatMapComponents (
  matched: Array<RouteRecord>,
  fn: Function
): Array<?Function> {
  return flatten(matched.map(m => {
    return Object.keys(m.components).map(key => fn(
      m.components[key],
      m.instances[key], // 获取组件中的实例
      m, key
    ))
  }))
}


function bindEnterGuard (
  guard: NavigationGuard,
  match: RouteRecord,
  key: string
): NavigationGuard {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, cb => {
        // 如果next(cb)中的参数是个函数,把这个函数收集起来
      if (typeof cb === 'function') {
        if (!match.enteredCbs[key]) {
          match.enteredCbs[key] = []
        }
        match.enteredCbs[key].push(cb) // 收集next中的回调函数
      }
      next(cb)
    })
  }
}
```
然后我们在回忆下`router-view`这个组件是当路由有变化时才会去渲染组件，但是当我们执行`beforeRouteEnter`这个钩子的时候，当前的路由信息还是旧的，还没有变更成新的路由信息，所以`router-view`组件没有渲染过该组件，那么所以`beforeRouteEnter`中就拿不到vm实例。但是也别急，如果还想在`beforeRouteEnter`钩子中拿到当前组件实例去做某些操作，那么可以使用`next(vm => {...})`回调的方式去获取当前组件实例，调用的时机就是在组件渲染完之后调用这个回调函数。
注意: 这里也有个问题，就是在vue-router比较低的版本`3.4.6`之前的版本中此处存在内存泄露的问题。
```js
runQueue(queue, iterator, () => {
    // wait until async components are resolved before
    // extracting in-component enter guards
    const enterGuards = extractEnterGuards(activated)
    const queue = enterGuards.concat(this.router.resolveHooks)
    runQueue(queue, iterator, () => {
    if (this.pending !== route) {
        return abort(createNavigationCancelledError(current, route))
    }
    this.pending = null
    onComplete(route)
    if (this.router.app) {
        this.router.app.$nextTick(() => {
        handleRouteEntered(route)
        })
    }
    })
})

export function handleRouteEntered (route: Route) {
  for (let i = 0; i < route.matched.length; i++) {
    const record = route.matched[i]
    for (const name in record.instances) {
      const instance = record.instances[name]
      const cbs = record.enteredCbs[name]
      if (!instance || !cbs) continue
      delete record.enteredCbs[name]
      for (let i = 0; i < cbs.length; i++) {
        if (!instance._isBeingDestroyed) cbs[i](instance) // 当实例已经销毁时，不再执行该回调
      }
    }
  }
}
``` 
`3.4.6`版本之前没有这个判断实例是否销毁的操作，会直接执行这个回调，所以导致内存泄露，如果想使用这个功能的朋友建议路由升级到`3.4.6`以上版本。

至于`beforeRouteUpdate、beforeRouteLeave`为什么能拿到实例也就很明了了，就是当`router-view`组件渲染组件的时候在route上已经记录了组件实例与路由的对应关系。当然里面还有当组件发生变更了对应实例也会相应变更，更细节的代码建议大家去看源码。

## 是如何监`popstate`事件的，又是何时解除监听的
这块是在install的时候，如果是根节点会执行一个`router.init()`函数，我们看下这个函数都做了什么。

```js
    this.apps.push(app)
    app.$once('hook:destroyed', () => {
        // 监听每个组件的destroyed事件
      const index = this.apps.indexOf(app)
      if (index > -1) this.apps.splice(index, 1)
      if (this.app === app) this.app = this.apps[0] || null
        // 如果组件不存在，执行销毁popstate事件监听
      if (!this.app) this.history.teardown()
    })
    if (this.app) {
      return
    }
    this.app = app
    const history = this.history
    if (history instanceof HTML5History || history instanceof HashHistory) {
      const setupListeners = routeOrError => {
        history.setupListeners()
      }
      // 路由切换完成之后，设置popstate监听
      history.transitionTo(
        history.getCurrentLocation(),
        setupListeners,
        setupListeners
      )
    }
```
上述是简化后的代码，我们可以看到是在此时进行popState监听，当我们触发pushState/replaceState事件时，vue-router都会监听到。

注意：此处也存在一个小问题，在vue-router< 3.3.0版本中，是不存在popState事件销毁一说的，只要监听上，就会一直监听，所以之前我也记录过一个问题，感兴趣的大家可以看下，链接。

至此，您应该对vue-router有个更全面的认识了吧！










