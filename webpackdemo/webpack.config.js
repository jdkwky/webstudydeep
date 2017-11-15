// __dirname是nodejs中的一个全局变量，它指向当前执行脚本所在目录
module.exports={
	devtool:'eval-source-map',
	entry:__dirname+'/app/main.js',
	output:{
		path:__dirname+'/public',
		filename:'bundle.js'
	},
	devServer:{
		contentBase:'./public',
		historyApiFallback:true,
		inline:true,
		port:9999
	}
}