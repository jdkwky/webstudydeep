function jsonStringify(params, index=0) {
    const regxIgnore = /undefined|symbol|function/;
    const regxString = /string|boolean|number/;
    const regxNew = /String|Boolean|Number/;
    if(regxIgnore.test(typeof params)){
        return "";
    }else if(regxString.test(typeof params) || (params instanceof  String) || (params instanceof Number) ||(params instanceof Boolean) ){
        return '"' + String(params) + '"';
    }else {
        // 对象或者数组
        // 判断是对象或者是数组
        const isArray = Object.prototype.toString.call(params) === '[object Array]';
        let result = "";
        if(isArray){
            // 数组
            if(index ==0){
                result ='"' ;
            }
            result += '[';
            for(let val of params){
                if((typeof val == 'object') && val){
                    const i = index + 1;
                    const v = jsonStringify(val, i);
                    result +=  v + ",";
                }else if (val) {
                   result +=  String(val) + ",";
                }else{
                    result +=',';
                }
            }
            result = result.substring(0, result.length-1);
            result += "]";
            if(index == 0){
                result += '"';
            }
        }else{
            // 对象
            if(index == 0){
                result ='"';
            }
            result += "{";
            for(let val in params){
                if((typeof params[val]== 'object') && params[val]){
                    const ai = index + 1;
                    const v = jsonStringify(params[val], ai);
                    result += '"' + val + '"' + ":" + v + ",";
                }else if (params[val]){
                   result +=  '"' + val + '"' + ":" + '"'+String(params[val]) +'"'+',';
                }else{
                    result +=',';
                }
            }
            result = result.substring(0, result.length-1);
            result += "}" ;
            if(index == 0){
                result += '"';
            }
        }
        return result;
    }
}


Function.prototype.call1=function(params){
    const context = arguments[0];
    if(context){ 
        const args = [ ...arguments].slice(1);
        context.fn = this;
        const res = context.fn(args);
        delete context.fn;
        return res;

    }else{ 
        return this([ ...arguments].slice(1));
    }
}