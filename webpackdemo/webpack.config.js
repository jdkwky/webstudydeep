// __dirname是nodejs中的一个全局变量，它指向当前执行脚本所在目录
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');



/**
 *  output： pubicPath是js文件最后引入时加的前缀， 
 *  filename: 是引入js文件的路径，如果没有定义publicPath，则会走相对路径
 * 如果有publicPath，则直接引入filename路径然后前缀加上publicpath
 * 
 * 
 */

module.exports={
	devtool:'eval-source-map',
	mode:'development',
	context: path.resolve(__dirname),
	entry:{
		main:'./app/main.js',
		utils:'./app/utils.js'
	},
	output:{
		path:__dirname+'/static',
		filename:'js/[name]-[chunkHash:5].js',
		// publicPath: '../../../'
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
			// inject: false,
			template: './public/index.html',
			filename:'test/sindex.html'
		})
	]


}