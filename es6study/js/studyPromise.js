window.onload = function(argument) {
    var promise = new Promise(function(resolve, reject) {
        if (true) {
            resolve('123');
        } else {
            reject('error');
        }
    });
    promise.then(value => {
        console.log(value);
    }).catch(error => {
        console.log(error);
    });
    console.log('in onload');
    var p1 = new Promise(function(resolve, reject) {
        setTimeout(() => reject(new Error('fail')), 3000);
    	console.log('run also');
    	setTimeout(()=>console.log('promise setTimeOut'),0);
    });
    var p2 = new Promise(function(resolve, reject) {
        setTimeout(() => resolve(p1), 1000);
    })
    p2.then(result => {
        console.log(result)
    }).catch(error => {
        console.log(error);
    })
    
    
    // lazyMan
    
}