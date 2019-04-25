// __dirname是nodejs中的一个全局变量，它指向当前执行脚本所在目录
module.exports={
	devtool:'eval-source-map',
	entry:{
		main: __dirname+'/app/main.js',
		utils: __dirname+'/app/utils.js'
	},
	output:{
		path:__dirname+'/static',
		filename:'js/[name]-[chunkHash:5].js'
	},
	devServer:{
		contentBase:'./public',
		historyApiFallback:true,
		inline:true,
		port:9999
	}
}