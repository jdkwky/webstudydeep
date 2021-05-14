> 在 js文件中 new Vue({ data: {},methods:{} })中new 的Vue是什么

core/index.js

```javascript
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'

initGlobalAPI(Vue)
```

core/instance/index.js

```javascript
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
  	// 如果不是通过 new Vue({}) 去获取， 则会有提示信息
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // _init 来源于 initMixin函数
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

```

core/instance/init.js

```javascript
Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
  	// 初始化一些状态，$parent,$children,$refs,_isMounted _isDestroyed 等
    initLifecycle(vm)
  	// 清空当前events对象
    initEvents(vm)
  	// 挂载 $slots  初始化 $scopedSlots
    initRender(vm)
  	// 调用beforeCreate钩子  如果没有定义 则不会像外界$emit  注意： 在beforeCreate钩子中不存在data 或者methods中的数据或者方法
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
  	// 在created钩子中存在了 data 中的数据
    callHook(vm, 'created') 

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

core/instance/state.js

```javascript
export function initState(vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  // 初始化props
  if (opts.props) initProps(vm, opts.props)
  // 初始化 methods
  if (opts.methods) initMethods(vm, opts.methods)
  // 初始化 data
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  // 初始化 computed
  if (opts.computed) initComputed(vm, opts.computed)
  // 初始化watch
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

> 数据代理如何实现的: 实际上读写的是sourceKey中的数据，this上的数据是多加了一层代理而已

```javascript
export function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```



- initProps

  ```javascript
  if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) ||
        config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
   } else {
     defineReactive(props, key, value)
   }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
  	// 代理到 vm 对象上
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  ```

  > - props (如果不是从data中获取的数据则不会被监听 ❌ 也是会被监听)；如果没有传入props，则会给一个默认值该值是被监听的
  > - props数据流是从上自下单向流动的；如果props是值类型则不允许在组件中被修改，如果是引用类型的修改其中的属性值是不会报错的，也可以通过$set给引用类型赋值
  >
  > - 最后将props中的属性代理到当前Vue的实例上也就是this上

  Eg：

  ```javascript
  // Test 组件中 (子组件中定义默认props)
  <template>
      <div>
          <el-button @click="handleChangeProps">更改props信息</el-button>
          <div>Test {{ people.name }}</div>
      </div>
  </template>
  
    props:{
      people:{
          type: Object,
          default: ()=>({
              name: 'test'
          })
      }
    },
    methods: {
        handleChangeProps() {
          	// （1） 形式调用 
            this.people.name ='haha'; //（1） 会刷新页面  （2）页面不会刷新
            console.log(this.people,'people'); // （1）并且people是被监听的  存在_dep （2）数据没有被监听 也不存在_dep
        }
    },
    
  
  // (1) 父组件 Index.vue  引用 子组件 Test
  <Test></Test>
  
  // （2）父组件Index.vue 引用子组件
  <Test :people="{ name: 'test' }"></Test>
  
  ```

- initMethods

  > methods中的函数不能用箭头函数，因为不是类是对象，箭头函数通过bind也不能更改this指向，所以不能使用箭头函数

  ```javascript
  // bind 绑定函数 更改函数this指向  指向vm实例
  vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
  ```

- initData

  > - component中的data 必须是函数 不能是对象，原因是因为组件可能会渲染成多个实例，如果是对象的话则对个实例共享一个对象，那么就会出现问题
  > - 如果data 函数中存在props 或者其他已经被观察的对象，也只会被观察一次
  > - data 如果在组件中写了就必须写返回值， 如果不需要data就可以不写

  oberve 

  - 数组

    ```javascript
    const methodsToPatch = [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse'
    ]
    
    /**
     * Intercept mutating methods and emit events
     */
    methodsToPatch.forEach(function (method) {
      // cache original method
      const original = arrayProto[method]
      def(arrayMethods, method, function mutator (...args) {
        const result = original.apply(this, args)
        const ob = this.__ob__
        let inserted
        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args
            break
          case 'splice':
            inserted = args.slice(2)
            break
        }
        if (inserted) ob.observeArray(inserted)
        // notify change
        ob.dep.notify()
        return result
      })
    })
    ```

    如果是插入数组元素方法则将插入的数据变成可监听的然后更新视图，如果是删除数组元素方法则直接更新视图；

  - 非数组

    ```javascript
    defineReactive(obj, keys[i])
    ```

- initComputed

  - 可以有get set函数，关于set不能直接修改computed的值，如果直接修改了 会死循环

    ```javascript
    computed: {
          dataList:{
            get(){
                console.log('in this get');
                return this.dataPeople.list || [];
            },
            set(){
                // console.log('in this set');
              	// ✅ 正确
                this.dataPeople.list.push(+new Date);
              	// ❌ 错误
              	this.dataList = []
            }
          }
      }
    ```

  - computed初始化的时候是个惰性watcher，返回的数据是可缓存的

    ```javascript
    export function defineComputed(
      target: any,
      key: string,
      userDef: Object | Function
    ) {
      const shouldCache = !isServerRendering()
      if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = shouldCache
          ? createComputedGetter(key)
          : createGetterInvoker(userDef)
        sharedPropertyDefinition.set = noop
      } else {
        sharedPropertyDefinition.get = userDef.get
          ? shouldCache && userDef.cache !== false
            ? createComputedGetter(key)
            : createGetterInvoker(userDef.get)
          : noop
        sharedPropertyDefinition.set = userDef.set || noop
      }
      if (process.env.NODE_ENV !== 'production' &&
        sharedPropertyDefinition.set === noop) {
        sharedPropertyDefinition.set = function () {
          warn(
            `Computed property "${key}" was assigned to but it has no setter.`,
            this
          )
        }
      }
      Object.defineProperty(target, key, sharedPropertyDefinition)
    }
    
    function createComputedGetter(key) {
      return function computedGetter() {
        const watcher = this._computedWatchers && this._computedWatchers[key]
        if (watcher) {
          if (watcher.dirty) {
            // dirty 标记  标记 是否需要重新计算watcher的值
            watcher.evaluate()
          }
          // 将computed中依赖到的响应式数据观察者中添加渲染
          if (Dep.target) {
            watcher.depend()
          }
          // 如果依赖数据没有变化则直接返回缓存数据
          return watcher.value
        }
      }
    }
    ```

    

  - computed的值如果是基础类型的不能被直接修改，如果是引用类型可以修改程序不会报异常但是还是不建议直接修改；

  - 如果computed直接返回数据也可以使用，就是当数据更改变动时不会更新视图, 返回的数据没有被劫持，但是会被挂载到vm对象上；

  - 如果computed数据没有被使用（get）的话，是不会被收集的

    ```javascript
    age(){
       return { age: 18 }
    }
    mounted(){
      console.log(this.age, 'this.age'); // 在this上能获取到age的数据
    }
    ```

- initWatch

  - $watch 第一个参数可以是函数，表示监听的是这个函数返回的数据，第二个参数是callback函数，第三个是配置参数
  - 如果一旦配置了callback函数 ，只要是监听的数据发生变化 是一定会执行的。

  ```javascript
  Vue.prototype.$watch = function (
      expOrFn: string | Function,
      cb: any,
      options?: Object
    ): Function {
      const vm: Component = this
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
      }
      options = options || {}
      options.user = true
      const watcher = new Watcher(vm, expOrFn, cb, options)
      if (options.immediate) {
        try {
          // 如果是立即执行的则立即执行回调函数
          cb.call(vm, watcher.value)
        } catch (error) {
          handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
        }
      }
      return function unwatchFn() {
        watcher.teardown()
      }
    }
  ```

  - Watcher 中的get()方法

    ```javascript
    get () {
        pushTarget(this)
        let value
        const vm = this.vm
        try {
          value = this.getter.call(vm, vm)
        } catch (e) {
          if (this.user) {
            handleError(e, vm, `getter for watcher "${this.expression}"`)
          } else {
            throw e
          }
        } finally {
          // "touch" every property so they are all tracked as
          // dependencies for deep watching
          if (this.deep) {
            traverse(value)
          }
          popTarget()
          //
          this.cleanupDeps()
        }
        return value
    }
    
      /**
       * Clean up for dependency collection.
       */
    // 清除依赖收集 如果之前收集过这个dep但是由于组件卸载等原因导致这个依赖不需要再收集了 就将其清除掉
      cleanupDeps () {
        let i = this.deps.length
        while (i--) {
          const dep = this.deps[i]
          if (!this.newDepIds.has(dep.id)) {
          dep.removeSub(this)
          }
        }
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
      }
    ```
    
    

- 挂载$set

  ```javascript
  export function set (target: Array<any> | Object, key: any, val: any): any {
    if (process.env.NODE_ENV !== 'production' &&
      (isUndef(target) || isPrimitive(target))
    ) {
      warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key)
      target.splice(key, 1, val)
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val
      return val
    }
    const ob = (target: any).__ob__
    if (target._isVue || (ob && ob.vmCount)) {
      process.env.NODE_ENV !== 'production' && warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      )
      return val
    }
    if (!ob) {
      target[key] = val
      return val
    }
    // 设置值
    defineReactive(ob.value, key, val)
    // 重新渲染视图
    ob.dep.notify()
    return val
  }
  ```

  