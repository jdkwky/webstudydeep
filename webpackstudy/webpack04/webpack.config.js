const path = require('path');

class P {
    apply(compiler) {
        // 这里只是appLy方法不是改变this指向
        // 绑定
        compiler.hooks.emit.tap('emit', function() {
            console.log('emit');
        });
    }
}

class P1 {
    apply(compiler) {
        // 这里只是appLy方法不是改变this指向
        // 绑定
        compiler.hooks.afterPlugins.tap('emit', function() {
            console.log('afterPlugins');
        });
    }
}

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolveLoader: {
        modules: ['node_modules', './src/loader']
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    path.resolve(__dirname, 'src', 'loader', 'style-loader'),
                    path.resolve(__dirname, 'src', 'loader', 'less-loader')
                ]
            }
        ]
    },
    plugins: [new P(), new P1()]
};
