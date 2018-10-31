window.onload = function() {
    const getSingle = function(fn) {
        var set;
        return function() {
            return set || (set = fn.apply(this, arguments));
        };
    };

    var test = getSingle(function() {
        console.log('===========================');
        console.log('single');
        console.log('===========================');
    });
    var t1 = test();
    var t2 = test();
    console.log('===========================');
    console.log(t1 === t2);
    console.log('===========================');

    Function.prototype.before = function(beforefn) {
        var _self = this;
        return function() {
            beforefn.apply(this, arguments);
            // return _self.apply(this, arguments);
        };
    };

    Function.prototype.after = function(afterfn) {
        var _self = this;
        return function() {
            _self.apply(this, arguments);
            afterfn.apply(this, arguments);
        };
    };

    var func = function() {
        console.log(2);
    };
    func = func
        .before(function() {
            console.log(1);
        })
        .after(function() {
            console.log(3);
        });

    func();

    Function.prototype.center = function() {
        console.log('===========================');
        console.log('this', this);
        console.log('===========================');
        this.apply(this, arguments);
    };
    Function.prototype.center();

    Function.prototype.uncurrying = function() {
        var self = this;
        return function() {
            var obj = Array.prototype.shift.call(arguments);
            return self.apply(obj, arguments);
        };
    };
    var funUnCurrying = function() {
        console.log('===========================');
        console.log('fun un Currying', this);
        console.log('===========================');
    };
    funUnCurrying = funUnCurrying.uncurrying();
    funUnCurrying({ a: '123' }, 2, 3);
};
