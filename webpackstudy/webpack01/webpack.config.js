const path = require('path');
// 插件都是类
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptmizeCss = require('optimize-css-assets-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// cleanWebpackPlugin

module.exports = {
  optimization: {
    // 优化项
    minimizer: [
      new UglifyjsWebpackPlugin({
        exclude: /node_modules/,
      }),
      new OptmizeCss(),
    ],
    splitChunks: {
      cacheGroups: {
        common: {
          minSize: 0,
          minChunks: 2,
          chunks: 'all',
        },
      },
    },
  },
  devServer: {
    // 开发服务器 端口
    port: 3000,
    progress: true,
    contentBase: './dist',
    // 跨域代理
    // proxy: {
    //     api: {
    //         target: 'http://localhost:8080',
    //         pathRewrite: { '/api': '' } // 重写路径
    //     }
    // },
    // 前端模拟数据
    // before(app) {
    //     // 提供的方法
    // }
    // 有服务端 不想用代理来处理 能不能在服务端中启动webpack端口 用服务端端口， 直接在服务端调用webapck启动
  },
  mode: 'development', // 模式默认两种  production  development
  entry: {
    index: './src/index.js',
    other: './src/other.js',
  }, // 入口
  // 增加映射文件 可以帮助调试代码 产生map文件 对应源代码文件
  devtool: 'source-map',
  // 监控当前代码变化
  watch: true,
  // 监控当前代码变化参数配置
  watchOptions: {},
  output: {
    filename: 'bundle.[hash:8].js', // 打包后的文件名
    path: path.resolve(__dirname, 'dist'), // 路径必须是一个绝对路径
  },
  plugins: [
    // new CleanWebpackPlugin(),
    // 插件 使用顺序没有先后
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      // minify: {
      //  压缩
      //     removeAttributeQuotes: true,
      //     collapseWhitespace: true
      // },
      // hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
    new webpack.ProvidePlugin({
      // 为每个用到该模块的引入模块   DefinePlugin 是定义变量； ProvidePlugin 是引入模块
      $: 'jquery',
    }),
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist', 'manifest.json'),
    }),
  ],
  resolve: {
    alias: {
      // 别名
    },
    extensions: ['.js', '.css', 'vue'], // 默认扩展名
  },
  module: {
    noParse: /jquery/, // 不去解析某些文件的依赖关系 优化点
    rules: [
      // {
      //     test: /\.js$/,
      //     use: {
      //         loader: 'eslint-loader',
      //         options: {
      //             enforce: 'pre' // pre 先执行  post 后执行
      //         }
      //     }
      // },
      {
        test: /\.(jpg|jpeg|gif|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: false,
          },
        },
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // 用babel-loader 需要吧es6 => es5
              presets: [
                '@babel/preset-env',
                // 支持 jsx
                '@babel/preset-react',
              ],
              plugins: [
                //  支持es7 语法的
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime',
              ],
            },
          },
        ],
        exclude: /node_modules/, // loader不去解析 模块中的数据 优化
      },
      // 规则  css-loader 解析@import 这种语法  style-loader 是把css 插入到header标签中
      //  loader 特点  希望单一
      // loader 用法  字符串 只用一个loader
      //  多个loader 需要数组
      //  loader 顺序  从右向左执行
      //  loader 还以写成对象形势
      {
        test: /\.css/,
        exclude: /node_modules/,
        use: [
          // {
          //     loader: 'style-loader',
          //     options: {
          //         insert: function insertAtTop(element) {
          //             var parent = document.querySelector('head');
          //             // eslint-disable-next-line no-underscore-dangle
          //             var lastInsertedElement =
          //                 window._lastElementInsertedByStyleLoader;

          //             if (!lastInsertedElement) {
          //                 parent.insertBefore(
          //                     element,
          //                     parent.firstChild
          //                 );
          //             } else if (lastInsertedElement.nextSibling) {
          //                 parent.insertBefore(
          //                     element,
          //                     lastInsertedElement.nextSibling
          //                 );
          //             } else {
          //                 parent.appendChild(element);
          //             }

          //             // eslint-disable-next-line no-underscore-dangle
          //             window._lastElementInsertedByStyleLoader = element;
          //         }
          //     }
          // },
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
      {
        test: /\.less/,
        use: [
          // {
          //     loader: 'style-loader',
          //     options: {
          //         insert: function insertAtTop(element) {
          //             var parent = document.querySelector('head');
          //             // eslint-disable-next-line no-underscore-dangle
          //             var lastInsertedElement =
          //                 window._lastElementInsertedByStyleLoader;

          //             if (!lastInsertedElement) {
          //                 parent.insertBefore(
          //                     element,
          //                     parent.firstChild
          //                 );
          //             } else if (lastInsertedElement.nextSibling) {
          //                 parent.insertBefore(
          //                     element,
          //                     lastInsertedElement.nextSibling
          //                 );
          //             } else {
          //                 parent.appendChild(element);
          //             }

          //             // eslint-disable-next-line no-underscore-dangle
          //             window._lastElementInsertedByStyleLoader = element;
          //         }
          //     }
          // },
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
    ],
  },
};
