let isDone: boolean = false;
console.log(isDone);
// 数组
let array: number[] = [1, 2, 3];
console.log(array, 'array');

let array1: Array<number> = [4, 5, 6];
console.log(array1, 'array1');

// 元祖

let tuple: [number, string] = [1, 'a'];
console.log(tuple, 'tuple');

// let tuple1: [number] = [1, 3, 3, 3];
// console.log(tuple1, 'tuple1');

// 枚举

enum Color {
    Red = 1,
    Green = 2,
    Blue = 4
}

console.log(Color.Red, Color.Green, Color[1]);

// 任意类型
let any: any = 1;
console.log(any, 'any num');
any = 'q';
console.log(any, 'any str');

any = [1, 3, 4];
console.log(any, 'any list');

// 类型断言

let someValue: string = '123';
let strLength: number = (<string>someValue).length;
console.log(strLength, 'strLength');
