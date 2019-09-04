window.onload = function () {
    // 存在性   hasOwnProperty 和 in

    var obj = {
        a: 'a'
    }
    var objSub = {};
    objSub.__proto__ = obj;
    objSub.b = 'b';
    console.log(objSub);


    console.log('b' in objSub, 'in b');
    console.log('a' in objSub, 'in a');

    console.log(objSub.hasOwnProperty('a'), 'hasOwnProperty a');
    console.log(objSub.hasOwnProperty('b'), 'hasOwnProperty b');

    // ？ __proto__ 和 prototype  关系

}