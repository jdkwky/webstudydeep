- installed

  ```javascript
    const version = Number(Vue.version.split('.')[0])
  
    if (version >= 2) {
      Vue.mixin({ beforeCreate: vuexInit })
    } else {
      // override init and inject vuex init procedure
      // for 1.x backwards compatibility.
      const _init = Vue.prototype._init
      Vue.prototype._init = function (options = {}) {
        options.init = options.init
          ? [vuexInit].concat(options.init)
          : vuexInit
        _init.call(this, options)
      }
    }
  
    /**
     * Vuex init hook, injected into each instances init hooks list.
     */
  
    function vuexInit () {
      const options = this.$options
      // store injection
      // 将$store注入到this上
      if (options.store) {
        this.$store = typeof options.store === 'function'
          ? options.store()
          : options.store
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store
      }
    }
  ```

  

- new Store
  - 递归查找父子模块关系，父module和 子module对应关系
  - install module  将各个module中的mutations、actions等注册
  - 将state 和getters 中的数据放到new Vue({ data: $$state, computed:computed })中