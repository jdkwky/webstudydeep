const pluginName = "ConsoleBuildWebpackPlugin";

class ConsoleBuildWebpackPlugin {
    apply(compiler){
        compiler.hooks.run.tap(pluginName,compilation=>{
            console.log('webpack 构建过程开始了~~~')
        })
    }
}

module.exports = ConsoleBuildWebpackPlugin;