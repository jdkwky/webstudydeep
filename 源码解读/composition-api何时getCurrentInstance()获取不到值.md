> 深挖日常遇到的每个问题，积跬步，至千里

**注：以下分析为composition-api适配vue2版本中的1.7.1版本代码**

## 问题描述

相信大家一定都遇到过这种情况，在使用composition-api的setup函数中，想通过getCurrentInstance函数在事件或者异步函数中获取当前组件的实例是怎么也拿不到的，但是如果放到setup的同步函数中，则能轻轻松松获取到。比如：

```js
setup() {
    const onClick = () => {
        const instance = getCurrentInstance();  // instance = null;
    }
    return {
        onClick
    }
}
```

```js
setup() {
    const getData = async () => {
        await fetchData();
    }
    onMounted(async() => {
        await getData();
        const instance = getCurrentInstance(); // instance = null;
    })
}
```
上述情况都**无法**准确获取到当前组件的instance值，这种情况下却**可以**获取到：
```js
setup() {
    const getData = async () => {
        const instance = getCurrentInstance(); // instance = 当前组件值;
        await fetchData();
    }
    onMounted(async() => {
        await getData();
    })
}
```

```js
setup() {
    const instance = getCurrentInstance();  // instance = 当前组件值;
    const onClick = () => {}
    return {
        onClick
    }
}
```
下面让我们一起解开`getCurrentInstance`神秘面纱，具体分析下都什么时候能获取到值，什么时候获取不到值。

## 问题解析
按照国际惯例，我们还是先从composition-api使用方式入手，composition-api使用方式都是
```js
import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);
```
所以我们还是从composition-api中的`install.ts`文件入手：

### install 都做了什么

```ts
if (isVueRegistered(Vue)) {
    if (__DEV__) {
      warn(
        '[vue-composition-api] already installed. Vue.use(VueCompositionAPI) should be called only once.'
      )
    }
    return
  }

  if (__DEV__) {
    if (Vue.version) {
      if (Vue.version[0] !== '2' || Vue.version[1] !== '.') {
        warn(
          `[vue-composition-api] only works with Vue 2, v${Vue.version} found.`
        )
      }
    } else {
      warn('[vue-composition-api] no Vue version found')
    }
  }

  Vue.config.optionMergeStrategies.setup = function (
    parent: Function,
    child: Function
  ) {
    return function mergedSetupFn(props: any, context: any) {
      return mergeData(
        isFunction(parent) ? parent(props, context) || {} : undefined,
        isFunction(child) ? child(props, context) || {} : undefined
      )
    }
  }

  setVueConstructor(Vue)
  mixin(Vue)

```

很显然，和之前分析过的vue-router源码类似，composition-api也是先要判断是否install过，避免重复install问题，然后给出提示信息只有`vue2`可以使用这个组合式api,然后在`optionMergeStrategies`中增加了setup方法，在然后设置了Vue的构造函数，最后调用了`mixin`函数。

看到mixin函数，本能的就感觉可能和vue-router一样，要在这里搞事情了，然后看下mixin：

```ts
export function mixin(Vue: VueConstructor) {
  Vue.mixin({
    beforeCreate: functionApiInit,
    mounted(this: ComponentInstance) {
      afterRender(this)
    },
    beforeUpdate() {
      updateVmAttrs(this as ComponentInstance)
    },
    updated(this: ComponentInstance) {
      afterRender(this)
    },
  })
```
果然哈，也是在全局增加了mixin，然后每个组件的这几个生命周期钩子里执行一些特定的方法。

### beforeCreate 里都做了什么

```ts
  function functionApiInit(this: ComponentInstance) {
    const vm = this
    const $options = vm.$options
    const { setup, render } = $options

    if (render) {
      // keep currentInstance accessible for createElement
      $options.render = function (...args: any): any {
        return activateCurrentInstance(toVue3ComponentInstance(vm), () =>
          render.apply(this, args)
        )
      }
    }

    if (!setup) {
      return
    }
    if (!isFunction(setup)) {
      if (__DEV__) {
        warn(
          'The "setup" option should be a function that returns a object in component definitions.',
          vm
        )
      }
      return
    }

    const { data } = $options
    // wrapper the data option, so we can invoke setup before data get resolved
    $options.data = function wrappedData() {
      initSetup(vm, vm.$props)
      return isFunction(data)
        ? (
            data as (this: ComponentInstance, x: ComponentInstance) => object
          ).call(vm, vm)
        : data || {}
    }
  }
```

`functionApiInit`函数很明显，做了两件事，一是如果有render函数，则重新包裹一下render函数，执行一下`activateCurrentInstance方法`，如果有setup函数，那么把$options.data 包裹成一个函数，函数里执行`initSetup`函数。

`initSetup`函数又做了什么呢？ 
```ts
  function initSetup(vm: ComponentInstance, props: Record<any, any> = {}) {
    const setup = vm.$options.setup!
    const ctx = createSetupContext(vm)
    const instance = toVue3ComponentInstance(vm)
    instance.setupContext = ctx

    // fake reactive for `toRefs(props)`
    def(props, '__ob__', createObserver())

    // resolve scopedSlots and slots to functions
    resolveScopedSlots(vm, ctx.slots)

    let binding: ReturnType<SetupFunction<Data, Data>> | undefined | null
    activateCurrentInstance(instance, () => {
      // make props to be fake reactive, this is for `toRefs(props)`
      binding = setup(props, ctx)
    })

    if (!binding) return
    if (isFunction(binding)) {
      // keep typescript happy with the binding type.
      const bindingFunc = binding
      // keep currentInstance accessible for createElement
      vm.$options.render = () => {
        resolveScopedSlots(vm, ctx.slots)
        return activateCurrentInstance(instance, () => bindingFunc())
      }
      return
    } else if (isObject(binding)) {
      // ...
    }
  }
```
这个函数代码比较长，我稍微去除了一些跟本次问题无关的代码，可以看出先执行了一下`activateCurrentInstance`函数，然后如果setup返回的是渲染函数，则在对`$options.render`进行包裹，里面再执行一下`activateCurrentInstance`函数。

回忆下，在上面render函数包裹的时候也出现过`activateCurrentInstance`这个函数，下面我们看下这个函数里都做了什么：

```ts
export function activateCurrentInstance(
  instance: ComponentInternalInstance,
  fn: (instance: ComponentInternalInstance) => any,
  onError?: (err: Error) => void
) {
  let preVm = getCurrentInstance()
  setCurrentInstance(instance)
  try {
    return fn(instance)
  } catch (
    // FIXME: remove any
    err: any
  ) {
    if (onError) {
      onError(err)
    } else {
      throw err
    }
  } finally {
    setCurrentInstance(preVm)
  }
}

```
这个函数的作用很简洁，第一个作用就是记录一下当前组件实例，然后设置一下传递过来参数的组件实例，然后运行fn函数，由上面的分析可知，这个函数是render函数或者是setup执行函数，**最后当执行完之后，会将最开始保存的组件实例重置**。

下面是 `getCurrentInstance`和`setCurrentInstance`函数作用:
```ts
let currentInstance: ComponentInternalInstance | null = null

export function getCurrentInstance() {
  return currentInstance
}

export function setCurrentInstance(instance: ComponentInternalInstance | null) {
  if (!currentInstanceTracking) return
  const prev = currentInstance
  prev?.scope.off()
  currentInstance = instance
  currentInstance?.scope.on()
}
```
基本就是一个取值和赋值的函数。

## 总结
至此，我们基本可以分析出，只有`setup`或`render`中**同步函数才能获取**到当前组件实例，当 `activateCurrentInstance`函数执行完之后，当前的实例被重置成上一个组件的实例也就是`null`，所以在**异步函数中是获取不到**当前组件的实例的。

其实vue3中composition-api中获取组件实例也是这个规则，同步函数可以获取到，异步函数获取不到，但是具体实现代码跟composition-api包中有所差异，有兴趣大家可以去查看源码，或者等我分析vue3源码时大家再和本篇做个对比。