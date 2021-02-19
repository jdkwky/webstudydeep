function sealed(target){
    console.log(target);
}


@sealed
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

const greet = new Greeter('hello');
greet.greet();