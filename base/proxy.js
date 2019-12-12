// (
// function(params) {
//     var obj = new Proxy({},{
//         get: function( target, key, receiver ){
//             console.log(`getting ${key} !`, target, receiver );
//             return Reflect.get(target, key, receiver);
//         },
//         set: function ( target, key, receiver ){
//             console.log(`setting ${key}!`);
//             return Reflect.set(target,key,receiver);
//         }
//     });

//     obj.count = 1;
//     ++obj.count;

//     var fn = new Proxy(function(name){
//         console.log(name);
//     },{
//         apply: function(target, ctx, args){
//             console.log(args, 'args');
//             console.log(arguments, 'arguments');
//             console.log(ctx, 'ctx');
//         }
//     });
//     fn.call(obj, 'name');


//     // reflect

//     var reflectObj = {
//         foo: 1, 
//         bar : 2,
//         get baz(){
//             return this.foo + this.bar;
//         }
//     }

//     console.log(Reflect.get(reflectObj,'foo'));
//     console.log(Reflect.get(reflectObj, 'bar'));
//     console.log(Reflect.get(reflectObj, 'baz'));

// }

// ) ();

function defineReactive(obj) {
    for (let item in obj) {
        let value = obj[item];
        Object.defineProperty(obj, item, {
            set: function (newvalue) {
                console.log(value, newvalue, 'value newvalue');

                value = newvalue;
            },
            get: function () {
                console.log('get  value', value);
                return value;
            }
        })
    }

}



function defineReactiveProxy() {
    var obj = new Proxy({}, {
        set: function (target, key, value, receiver) {
            console.log(`setting ${key}`);
            return Reflect.set(target, key, value, receiver);
        },
        get: function (target, key, receiver) {
            console.log(`get ${key}`);
            return Reflect.get(target, key, receiver);
        }
    });
    console.log(obj, 'obj proxy');
    return obj;


}

var obj1 = { a: 1, b: '', c: '' };

defineReactive(obj1);
// console.log(obj1, 'obj');
obj1.a
obj1.a = 2;
obj1.b = 3;
console.log(obj1);

// var obj2 = {};
// var obj2 = defineReactiveProxy(obj2);
// // console.log(obj1.a);
// // obj1.b = 2;
// // obj1.a = 3;
// obj2.a = 1;
// obj2.a;
// obj2.list = [1, 2, 3];