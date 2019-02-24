window.onload= function(){
    // defineProperty
    const obj = {
        _name:''
    };
    Object.defineProperty(obj,'name',{
        set:function(value){
            this._name = value + 'hehehe';
        },
        get:function(){
            return this._name;
        }
    });
    Object.defineProperties(obj,{
        value:{
            value:10
        }
    });
    obj.name='xiaoming';

    function cb(val){
        console.log(val,'视图更新了~~~');
    }

    function defineReactive(obj,key,val){
        const dep = new Dep();
       
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get: function reactiveGetter(){
                dep.addSub(Dep.target);
                return val;
            },
            set: function reactiveSetter(newVal){
                if(val == newVal){
                    return;
                }
                dep.nodify();
                val = newVal;
                // cb(val);
            }
        });
    }

    function observer(value){
        if(!value || typeof value !='object'){
            return ;
        }
        // 递归循环
        for(let key in value){
            if(typeof value[key] == 'object'){
                dgObj(value[key],key,value);  
            }else{
                defineReactive(value, key , value[key]);
            }
        }
    }




    function dgObj(value,key,parent){
        if(value._ob_ ){
            return;
        }
        value._ob_ = value;
        defineReactive(parent , key , value);
        for(let k in value){
            if(typeof value[k] !='object'){
                defineReactive(value,k,value[k]);
            }else{
                dgObj(value[k],k,value);
            }
        }
    }


    function Vue (options){
        this._data = options.data;
        new Watcher();
        observer(this._data);
    }

    // 深拷贝
    const cObj = {
        test:{
            a:'a',
            b:'b'
        }
    };
    
    function deepCopy(cObj,newObj){
        for(let key in cObj){
            if(typeof cObj[key] =='object'  ){
                // 是对象
                // 需要重新给赋值
                if(!newObj){
                    newObj = {};
                }
                newObj[key] = {};
                deepCopy(cObj[key],newObj[key]);
            }else{
                if(!newObj){
                    newObj = {};
                }
                newObj[key] = cObj[key];
            }
        }
    }

    function deepCopyWrap(obj){
        let newObj = {};
        deepCopy(obj,newObj);
        return newObj;
    }

    const ccObj = {
        test:{
            name:'hello',
            info:{
                name:{
                    name:'wHello'
                }
            }
        },
        name:{}
    }
    const nObj1 ={};
    const nObj2 = {};

    deepCopy(ccObj,nObj1);
    deepCopy(cObj,nObj2);
    

    const aObj ={
        name:'hehe',
        age:18,
        info:{
            rect:'red',
            obj:{
                rect:'green'
            }
        }
    };


    const nObj3 = deepCopyWrap(ccObj);

    
    


    // 设置一个订阅者

    function Dep(){
        // this.subs = [];
    }

    Dep.prototype ={
        subs:[],
        addSub:function(subs){
            this.subs.push(subs);
        },
        nodify:function(){
            this.subs.forEach(sub =>{
                sub.update();
            });
        }
    };


    // 观察者

    function Watcher(){
        Dep.target = this;
    }

    Watcher.prototype ={
        update:function(){
            console.log('视图更新了！！！！~~~');
        }
    }

    Dep.target = null;

    new Vue({ data:aObj });
    
    
    aObj.name;
    aObj.age;
    aObj.info;
    aObj.name= '钢铁侠';
    aObj.age = 30;
    aObj.age = 18;
    console.log('===========================');
    console.log('aObj',aObj);
    console.log('===========================');
    aObj.info = { rect:'test' }; 
    aObj.info.rect = 'green';
    // aObj.info.obj.rect='purple';



}