- 父子组件生命周期的执行顺序

  > mounted： 子组件先执行父组件再执行，原因： 子组件的挂载先于父组件挂载；

  > beforeUpdate updated：同样是父组件先执行beforeUpdate 然后子组件执行 beforeUpdate => 子组件updated =>父组件updated
  
  > destroyed: 子组件先卸载父组件再执行，原因： 组件patch的过程也是层层递归的过程，所以先触发子组件再触发父组件；

- $mounted

  ```javascript
  export function mountComponent(
    vm: Component,
    el: ?Element,
    hydrating?: boolean
  ): Component {
    vm.$el = el
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode
      if (process.env.NODE_ENV !== 'production') {
        /* istanbul ignore if */
        if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
          vm.$options.el || el) {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          )
        } else {
          warn(
            'Failed to mount component: template or render function not defined.',
            vm
          )
        }
      }
    }
    callHook(vm, 'beforeMount')
  
    let updateComponent
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      updateComponent = () => {
        const name = vm._name
        const id = vm._uid
        const startTag = `vue-perf-start:${id}`
        const endTag = `vue-perf-end:${id}`
  
        mark(startTag)
        const vnode = vm._render()
        mark(endTag)
        measure(`vue ${name} render`, startTag, endTag)
  
        mark(startTag)
        vm._update(vnode, hydrating)
        mark(endTag)
        measure(`vue ${name} patch`, startTag, endTag)
      }
    } else {
      updateComponent = () => {
        vm._update(vm._render(), hydrating)
      }
    }
  
    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
  	// 创建watcher对象  如果组件data或者其他已经被observe的数据有被用到即获取了值，这时候dep就会将该watcher对象收集进去；
    // 一旦数据被set了值 就会通知dep中已经收集的watcher对象更新视图（这个视图更新过程一般是异步的）
    // 只有数据更新时才会触发 beforeUpdate 和updated 这两个钩子
    new Watcher(vm, updateComponent, noop, {
      before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate')
        }
      }
    }, true /* isRenderWatcher */)
    hydrating = false
  
    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true
      callHook(vm, 'mounted')
    }
    return vm
  }
  ```

  

