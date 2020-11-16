enum Status {
    Ready,
    Wating
}
enum Color {
    Red,
    Blue,
    Green
}

let status1 = Status.Ready;
let color = Color.Red;

console.log(status1, 'status', color, 'color');

status1 = Color.Red;

console.log(status1, 'status1');
