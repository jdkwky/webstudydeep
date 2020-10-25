const path = require('path');
const fs = require('fs');
const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');
const generator = require('@babel/generator').default;
const ejs = require('ejs');
const { SyncHook } = require('tapable');

class Compiler {
    constructor(config) {
        this.config = config || {};
        // 保存所有模块依赖
        this.modules = {};
        // 入口文件
        this.entry = config.entry;
        this.entryId = '';

        // 工作目录
        this.root = process.cwd();

        // 插件
        this.hooks = {
            entryOption: new SyncHook(),
            compile: new SyncHook(),
            afterCompile: new SyncHook(),
            afterPlugins: new SyncHook(),
            run: new SyncHook(),
            emit: new SyncHook(),
            done: new SyncHook()
        };
        // 解析plugins 通过tapable
        const plugins = this.config.plugins;
        if (Array.isArray(plugins)) {
            plugins.forEach(plugin => {
                plugin.apply(this);
            });
        }
        this.hooks.afterPlugins.call();
    }

    // 获取资源
    getSource(modulePath) {
        let content = fs.readFileSync(modulePath, 'utf8');

        // 解析loader
        const rules = this.config.module.rules || [];

        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            const { test, use } = rule || {};
            let len = use.length;
            if (test.test(modulePath)) {
                // 需要通过 loader 进行转化
                while (len > 0) {
                    let loader = require(use[--len]);
                    content = loader(content);
                }
            }
        }

        return content;
    }

    // 解析语法
    parse(source, parentPath) {
        // AST 语法树解析
        const ast = babylon.parse(source);

        // 依赖的数组
        const dependencies = [];
        traverse(ast, {
            CallExpression(p) {
                const node = p.node;
                if (node.callee.name == 'require') {
                    node.callee.name = '__webpack_require__';
                    let moduleName = node.arguments[0].value;
                    moduleName =
                        moduleName + (path.extname(moduleName) ? '' : '.js'); // ./a.js
                    moduleName = './' + path.join(parentPath, moduleName); // ./src/a/js
                    dependencies.push(moduleName);
                    node.arguments = [types.stringLiteral(moduleName)]; // 改掉源码
                }
            }
        });

        const sourceCode = generator(ast).code;
        return { sourceCode, dependencies };
    }

    // 构建模块
    buildModule(modulePath, isEntry) {
        // 模块路径  是否是入口文件
        // 拿到模块内容
        const source = this.getSource(modulePath);

        // 获取模块id 需要相对路径

        const moduleName = './' + path.relative(this.root, modulePath);

        if (isEntry) {
            this.entryId = moduleName;
        }
        // 解析代码块
        const { sourceCode, dependencies } = this.parse(
            source,
            path.dirname(moduleName)
        );

        this.modules[moduleName] = sourceCode;
        dependencies.forEach(dep => {
            this.buildModule(path.join(this.root, dep), false);
        });
    }
    // 发射文件
    emitFile() {
        // 输出到哪个目录下
        let main = path.join(
            this.config.output.path,
            this.config.output.filename
        );
        let templateStr = this.getSource(path.join(__dirname, 'main.ejs'));
        let code = ejs.render(templateStr, {
            entryId: this.entryId,
            modules: this.modules
        });
        // 可能打包多个
        this.assets = {};
        // 路径对应的代码
        this.assets[main] = code;
        fs.writeFileSync(main, this.assets[main]);
    }
    // 运行
    run() {
        // 执行创建模块的依赖关系
        // 得到入口文件的绝对路径
        this.hooks.run.call();
        this.hooks.compile.call();
        this.buildModule(path.resolve(this.root, this.entry), true);
        this.hooks.afterCompile.call();

        this.emitFile();

        this.hooks.emit.call();
        this.hooks.done.call();
    }
}

module.exports = Compiler;
