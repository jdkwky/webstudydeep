function fibonacci(n) {
    if (typeof n != 'number') {
        throw new Error('n should be a Number')
    }
    if (n > 10) {
        throw new Error('n should <=10')
    }
    if (n < 0) {
        throw new Error('n should >=0')
    }
    if (n === 0) {
        return 0;
    } else if (n === 1) {
        return 1;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

if (require.main === module) {
    // 如果是直接执行 main.js，则进入此处
    // 如果 main.js 被其他文件 require，则此处不会执行。
    var n = Number(process.argv[2]);
    console.log('fibonacci(' + n + ') is', fibonacci(n));
}


exports.fibonacci = fibonacci;

//  1,1,2,3,5,8,13.......