// __dirname是nodejs中的一个全局变量，它指向当前执行脚本所在目录
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports={
	devtool:'eval-source-map',
	mode:'development',
	entry:{
		main:'./app/main.js',
		utils:'./app/utils.js'
	},
	output:{
		path:__dirname+'/static',
		filename:'js/[name]-[chunkHash:5].js',
		// publicPath: '../../'
	},
	devServer:{
		contentBase:'./public',
		historyApiFallback:true,
		inline:true,
		port:9999
	},

	plugins:[
		new CleanWebpackPlugin({
			verbose:true
		}),
		new HtmlWebpackPlugin({
			title:'my app',
			filename: 'index.html'
		})
	]


}