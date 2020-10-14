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
    mode: 'development', // 模式默认两种  production  development
    entry: {
        react: ['react', 'react-dom']
    }, // 入口

    output: {
        filename: '_dll_[name].js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist'), // 路径必须是一个绝对路径
        library: '_dll_[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '_dll_[name]', // 和 library同名
            path: path.resolve(__dirname, 'dist', 'manifest.json')
        })
    ]
};
