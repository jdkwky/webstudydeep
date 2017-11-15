window.onload = function() {
    var list = ['start', '20', 'abc', 'def'];
    for (var l of list) {

        if (l == 20) {
            continue;
        }

        if (l == 'abc') {
            break;
        }
        console.log(l);
    }
    var map = new Map();
    map.set('name', 'sc');
    map.set('age', 18);
    map.set('favor', 'nothing');
    for ([key, value] of map) {
        console.log(key, value);
    }

    function* quips(name) {
        const realName=yield judgeName(name);
        yield console.log(realName);
        yield console.log('希望你能喜欢这篇介绍ES6的译文');
        if (name.startsWith('X')) {
            yield console.log('你的名字' + name + '首字母是X,这很酷！');
        }
        yield console.log("我们下次再见");
        return name;
    }
    // 生成器函数
    function judgeName(name){
    	setTimeout(function(){
    		console.log('judgeName'+2000+"ms delay");
    	},2000);
    	if(name){
    		return name;
    	}
    	return new Error('name 不能为空');
    }
    var iter = quips('jorendorff');
    console.log(iter);
    iter.next();
    iter.next();
    iter.next();
    iter.next();
    // iter.send('text');
    // iter.next();

}