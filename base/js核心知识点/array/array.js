// 在一个长度为n的数组里的所有数字都在0~n-1的范围内。数组中某些数字是重复的
// 但是不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意重复
// 的数字。例如输入长度为7的数组[ 2, 3, 1,0, 2, 5,3 ],那么对应的输出是重复
// 的数字 2 或者 3。


function getDeliputeNumber(array){
    for(let i = 0 , len = array.length; i < len; i++){
        const a = array[i];
        const b = array[a -1];
        if(i === a-1){
            continue;
        }
        if(a === b ){
            return a ;
        }else {
            array[i] = b;
            array[a -1] = a;
        }
    }
}
const testArray = [ 2, 3, 1,0 ];
const result = getDeliputeNumber(testArray);
console.log('===========================');
console.log('result', result);
console.log('===========================');