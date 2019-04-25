(
    function(params) {
        var obj = new Proxy({},{
            get: function( target, key, receiver ){
                console.log(`getting ${key} !`, target, receiver );
                return Reflect.get(target, key, receiver);
            },
            set: function ( target, key, receiver ){
                console.log(`setting ${key}!`);
                return Reflect.set(target,key,receiver);
            }
        });

        obj.count = 1;
        ++obj.count;

        var fn = new Proxy(function(name){
            console.log(name);
        },{
            apply: function(target, ctx, args){
                console.log(args, 'args');
                console.log(arguments, 'arguments');
                console.log(ctx, 'ctx');
            }
        });
        fn.call(obj, 'name');


        // reflect

        var reflectObj = {
            foo: 1, 
            bar : 2,
            get baz(){
                return this.foo + this.bar;
            }
        }

        console.log(Reflect.get(reflectObj,'foo'));
        console.log(Reflect.get(reflectObj, 'bar'));
        console.log(Reflect.get(reflectObj, 'baz'));

    }
)();