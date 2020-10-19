const pluginName = 'ConsoleBuildWebpackPlugin';

class ConsoleBuildWebpackPlugin {
    apply(compiler) {
        compiler.hooks.run.tapPromise(pluginName, compilation => {
            return new Promise(resolve => {
                setTimeout(() => {
                    console.log(`webpack ${pluginName}构建过程开始了~~~`);
                    resolve('webpack1');
                }, 1000);
            });
        });
        compiler.hooks.run.tapPromise(pluginName, compilation => {
            return new Promise(resolve => {
                console.log(`webpack ${pluginName}构建进行中~~~`);
                resolve('webpack2');
            });
        });
    }
}

module.exports = ConsoleBuildWebpackPlugin;
