let uid = 0;
function observe (value) {
    if(value.__ob__) {
        return value.__ob__
    }
    const ob = new Observer(value);
    return ob;
}

class Watcher {
    constructor() {
        this.newDepIds = new Set()
        this.newDeps = [];
        this.depIds = new Set();
        this.id = uid++;

    }
    addDep (dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }
    update() {
        queueWatcher(this)
    }
    
}

class Dep {
    constructor() {
        this.id = uid ++;
        this.subs = [];
    }
    depend () {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }
    notify () {
        const subs = this.subs.slice();
        console.log(subs, 'subs');
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    }
    addSub (sub) {
        this.subs.push(sub)
    }

}

class Observer {
    constructor(value) {
        value.__ob__ = this;
        // 简化写法，默认都是对象形式，先省略数组模式
        this.walk(value);
    }

    walk(obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }
}


function defineReactive (obj, key) {
    const dep = new Dep ();
    let value  = obj[key];
    Object.defineProperty(obj, key , {
        enumerable: true,
        configurable: true,
        get: function () {
            if(Dep.target) {
                dep.depend();
            }
            return value;
        },
        set: function (newVal) {
            value = newVal;
            dep.notify();
        }
    })
}

const has = {};
function queueWatcher (watcher) {
    const id = watcher.id
    if (has[id] == null) {
        has[id] = true
        setTimeout(() => {
            console.log('视图更新了~~');
        }, 0)
    }
}