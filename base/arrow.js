function Arrow4(){
	this.name = 'hello arrow4'
    this.sayHello5= function (){
        console.log(this.name ,'sayHello5');
    }
    this.sayHello6 = () =>{
        console.log(this.name ,'sayHello6');
    }
}



Arrow4.prototype.sayHello = function(str){

	console.log(this.name, 'hello wrap ', str)

	function test(){
		console.log(this.name, 'arrow4 Hello test', str);
	}

	test();

}

Arrow4.prototype.sayHello2 = function(str){
	
	console.log(this.name , ' hello2 wrap ', str);

	var test = () =>{
		console.log(this.name, 'arrow4 Hello test', str);
	}

	test();

}

Arrow4.prototype.sayHello3 = ()=>{
    console.log(this.name, '======>arrow function')
}

const a4 = new Arrow4()

a4.sayHello('normal')
a4.sayHello2('normal')
a4.sayHello.call({ name: 'obj hello arrow4' }, 'obj')
a4.sayHello2.call({ name:'obj hello arrow4 2' }, 'obj2')
a4.sayHello5('normal');
a4.sayHello6('normal');
a4.sayHello5.call({ name: 'obj hello arrow4' });
a4.sayHello6({ name: 'obj hello arrow4' });


console.log('===========================');
console.log('===========================');


a4.sayHello3();
a4.sayHello3.call({ name:'arrow function' })




console.log('===========================');
console.log('===========================');


class Arrow{
    constructor(){
        this.name = 'arrow'
    }
    sayHello(){
        console.log(this.name, "====> sayHello");
    }

    sayArrowHello = ()=>{
        console.log(this.name, "====> sayArrowHello");
    }
}

var a = new Arrow();

a.sayHello();
a.sayArrowHello();

a.sayHello.call({ name:'obj Arrow' });
a.sayArrowHello.call({ name:'obj Arrow' });
