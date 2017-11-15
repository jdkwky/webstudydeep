// class RangeIterator {
//     constructor(start, stop) {
//             this.value = start;
//             this.stop = stop;
//         }
//         [Symbol.iterator]() { return this; }
//     next() {
//         var value = this.value;
//         if (value < this.stop) {
//             this.value++;
//             return { done: false, value: value }
//         } else {
//             return { done: true, value: undefined }
//         }
//     }
// }

// function range(start, stop) {
//     return new RangeIterator(start, stop);
// }


// iterator生成器 
// *range能替代 classRangeIterator类的原因：
// 生成器是迭代器 
//   所有的生成器都有内建.next()和[Symbol.iterator]()方法
function* range(start, stop) {
    for (var i = start; i < stop; i++) {
        yield i;
    }
}
for (var value of range(0, 3)) {
    console.log('Ding! at floor#' + value);
}
// 数组的结构赋值的模式同样适用于任意迭代器
const [first, second, third] = range(0, 3);
console.log(first, second, third);

function* object() {
    yield { name: 'wky', age: '25', sex: 'femal' }
}
const obj = object();
console.log(obj.next());
console.log('*********************');
function testGeneral(){
	return 'hehe';
}
const gen=function* (){
	const f1=yield testGeneral();
	// console.log(f1);
	yield '124';
	yield '123';
	return '125'
}
const ge=gen();
console.log(ge.next());
console.log(ge.next());
console.log(ge.next());
console.log(ge.next());
for(let g of gen()){
	console.log(g);
}
console.log('*********************');