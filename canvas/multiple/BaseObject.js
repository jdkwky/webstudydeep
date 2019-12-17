/**
 *  register or cancel observe to Object
 * @param {Object} observe 
 */
class BaseObject {
    static name = 'baseObject'

    constructor() {
        // all observes 
        this.observers = [];
    }
    /**
     * 注册观察者
     * @param {Object} observer
     */
    registerObserver(observer) {
        const name = observer.name || BaseObject.name;
        // 只需要注册一次
        const hasObserver = this.observers.filter(val => val.name === name);
        if (hasObserver.length === 0) {
            // 说明不存在当前类型的观察者
            this.observers.push({
                name: name,
                observer: observer
            });
        }
    }
    /**
     * 取消注册过得观察者
     * @param {Object} observe 
     */
    cancelObserver(observe) {
        const name = observe.name || BaseObject.name;
        // 将不需要被观察的观察者注销
        this.observers = this.observers.filter(val => val.name !== name);

    }
    /**
     * 通知观察者
     */
    nodifyObserver() {
        this.observers.forEach(observer => {
            observer.update && observer.update.call(observer);
        });
    }
    /**
     * 数据状态有变化 或者当前状态存在变化 通知其他观察者更新
     */
    hasStatusChanged() {
        this.nodifyObserver();
    }

}

export default BaseObject;