// __dirname是nodejs中的一个全局变量，它指向当前执行脚本所在目录
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ConsoleBuildWebpackPlugin = require('./plugin/console');
const path = require('path');



/**
 *  output： pubicPath是js文件最后引入时加的前缀， 
 *  filename: 是引入js文件的路径，如果没有定义publicPath，则会走相对路径
 * 如果有publicPath，则直接引入filename路径然后前缀加上publicpath
 * 
 * 
 */

module.exports = {
	devtool: 'eval-source-map',
	mode: 'development',
	context: path.resolve(__dirname),  // 默认是配置文件根目录地址
	entry: {
		main: path.join(__dirname, 'app/main.js'), // 可以是绝对路径也可以是相对路径， 相对路径相对于context配置的路径
		// utils: './app/utils.js'
	},
	output: {
		path: path.join(__dirname, 'static'),  // 必须是绝对路径
		filename: 'js/[name]-[chunkHash:5].js',  // 要输出的文件名称
		publicPath: './'   // 引入文件是要加入的前缀
	},
	devServer: {
		contentBase: './public',
		historyApiFallback: true,
		inline: true,
		port: 9999
	},
	module:{
		rules:[
			{
				test: /\.js$/,
				exclude:/node_modules/,
				use:[{
					loader: "./loader/console",
					options:{
						name:'tetete'
					}
				},{
					loader:'./loader/frank'
				},{
					loader:'./loader/async'
				}]
			}
		]
	},

	module: {
		rules: [{
			test: /\.vue$/,
			loader: 'vue-loader'
		}, {
			test: /\.css$/,
			loader: ['style-loader', 'css-loader']
		}]
	},

	plugins: [
		new CleanWebpackPlugin({
			verbose: true
		}),
		new HtmlWebpackPlugin({
			title: 'my app',
			// inject: false,
			template: './public/index.html',
			filename: 'index.html'
		}),
		new VueLoaderPlugin(),
		new ConsoleBuildWebpackPlugin()
	]


}