const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        sumIndex: ['./src/sum.js']
    },
    mode: 'development',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: '_dll_[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '_dll_[name]',
            path: path.resolve(__dirname, 'dist', 'manifest.json')
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                // 支持 jsx
                                '@babel/preset-react'
                            ]
                        }
                    }
                ]
            }
        ]
    }
};
