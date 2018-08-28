window.onload = function() {
    const getSingle = function(fn) {
        var set;
        return function() {
            console.log('===========================');
            console.log(set, 'set');
            console.log('===========================');
            return set || (set = fn.apply(this, arguments));
        };
    };

    getSingle(function() {
        console.log('===========================');
        console.log('single');
        console.log('===========================');
    })();
    getSingle()();
};
