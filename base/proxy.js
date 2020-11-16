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
            set: function(newvalue) {
                console.log(value, newvalue, 'value newvalue');

                value = newvalue;
            },
            get: function() {
                console.log('get  value', value);
                return value;
            }
        });
    }
}

function defineReactiveProxy(obj) {
    return new Proxy(obj, {
        set: function(target, key, value, receiver) {
            console.log(`setting ${key}`);
            return Reflect.set(target, key, value, receiver);
        },
        get: function(target, key, receiver) {
            if (typeof target[key] == 'object') {
                return defineReactiveProxy(target[key]);
            }
            return Reflect.get(target, key, receiver);
        }
    });
}

// var obj1 = defineReactiveProxy({});

// obj1.p = { a: 1 };
// console.log(obj1.p.a);
// obj1.p.b = 2;
// console.log(obj1.p.b);

// obj1.list = [{ a: 1 }];
// obj1.list[0].a = 2;
// console.log();
// obj1.list.push(1);
// console.log(obj1.list);

var list = defineReactiveProxy([]);
// list.push(1);
list[0] = 1;
