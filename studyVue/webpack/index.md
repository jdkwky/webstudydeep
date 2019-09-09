#### 一 webpack基础篇

1. webpack 基础配置

    - 入口文件单一 

    ```javascript
        module.exports = {
          entry: './main.js',  // 入口文件 main.js 
          output: {
                filename: 'bundle.js', //将main 文件打包之后的文件为bundle.js文件
                path: path.resolve(__dirname, "dist") , // string  所有输出文件的目录
                publicPath: '/js/'   // 构建文件的输出目录
          }
        };
    ```
    - 入口文件不单一
  
    ```javascript
        module.exports = {
            entry: {
                bundle1: './main1.js', //入口文件多个
                bundle2: './main2.js'
            },
            output: {
                filename: '[name].js' //出口文件也是多个 参数name的值为bundle1 或 bundle2
            }
        };
    ```

    - module (rules / loaders 配置各种loader解析)
  
    ```javascript
        module.exports = {
            entry: {
                bundle1: './main1.js', //入口文件多个
                bundle2: './main2.js'
            },
            output: {
                filename: '[name].js' //出口文件也是多个 参数name的值为bundle1 或 bundle2
            },
            module:{
                rules:[
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader',
                        options: {
                            // extractCSS: extractVUE,
                            transformAssetUrls: {
                                video: 'src',
                                source: 'src',
                                img: 'src',
                                image: 'xlink:href'
                            },
                            compilerOptions: {
                                // 是否保留编译后html之间的空格
                                // preserveWhitespace: false
                            }
                        }
                    }
                ]
            }
        };
        
    ```

    - resolve (解析模块的可选项)
    
    ```javascript
        resolve: {  
            extensions: ['.js','.jsx', '.vue', '.json'],  // 用到的文件的扩展
            alias: { // 模块别名列表
                'common': resolve('src/common'), 
            }
        },
    ```

    - plugins 插件列表
    - optimization  优化配置（webpack4）

    ```javascript
        // 比如我们可以把一些公共代码打包成一个单独的chunk,比如某些公共模块，去重等。webpack3之前我们都用CommonsChunkPlugin插件将一些代码分割成一个chunk,在webpack4中，CommonsChunkPlugin被废弃，使用splitChunks/SplitChunksPlugin代替
    ```
    
2. webpack详解

    - webpack热更新（HMR - Hot Module Replacement）

    > 在程序运行过程中添加修改删除模块，无需重新加载整个页面。主要通过以下几种方式来显著增加开发速度
    > - 保留在完全重新加载页面时丢失的应用程序状态
    > - 只更新变更内容，节省宝贵的开发时间
    > - 调整样式速度快 - 几乎相当于在浏览器中调整样式的速度

    
    如何实现的：
    
    [参考文档webpack](https://juejin.im/post/5d6d0ee5f265da03f66ddba9)

    [实现原理](https://juejin.im/post/5d6d0ee5f265da03f66ddba9)
  


