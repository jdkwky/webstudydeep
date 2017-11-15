function* quips(name) {
    yield '你好' + name + '!';
    yield '希望你能喜欢这篇介绍ES6的译文';
    if (name.startsWidth('X')) {
        yield '你的名字' + name + ' 首字母是X，这很酷';
    }
    yield '我们下次再见';
}
function* foo(x){
	var y=2*(yield (x+1));
	var z=yield (y/3);
	return (x+y+z);
}