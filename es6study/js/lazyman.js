function _LazyMan(name) {
    this.promiseGetters = [];
    var makePromise = function() {
        var promiseObj = new Promise(function(resolve, reject) {
            console.log('hi this is ' + name);
            resolve();
        });
        return promiseObj;
    }
    this.promiseGetters.push(makePromise);
    var self = this;
    var sequence = Promise.resolve();
    setTimeout(function() {
        for (var i = 0; i < self.promiseGetters.length; i++) {
            var nowPromiseGetter = self.promiseGetters[i];
            var thenFunc = (function(nowPromiseGetter) {
                return function() {
                    return nowPromiseGetter();
                }
            })(nowPromiseGetter);
            sequence = sequence.then(nowPromiseGetter);
        }
    }, 0)
}
_LazyMan.prototype = {
    eat: function(food) {
        var makePromise = function() {
            var promiseObj = new Promise(function(resolve, reject) {
                console.log("Eat " + food + "~");

                resolve(); 
            })

            return promiseObj;
        }

        this.promiseGetters.push(makePromise);

        return this; // 实现链式调用
    },
    sleep: function(time) {
        var makePromise = function() {
            var promiseObj = new Promise(function(resolve, reject) {

                setTimeout(function() {

                    console.log("Wake up after " + time + "s!");

                    resolve();

                }, time * 1000);
            })

            return promiseObj;
        }

        this.promiseGetters.push(makePromise);

        return this;
    }

}

function LazyMan(name) {

    return new _LazyMan(name);

}
LazyMan("Hank").sleep(1).eat("dinner")