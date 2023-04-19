最近在回顾react文档的时候发现react在事件这块着重强调了一下，在react的事件中，需要写函数表达式而不要写函数调用方式即：

```jsx
<div onClick={onClick}></div>
```
众所周知哈，react内部自己有一套事件机制，所以我们必须写成官方推荐的这种形式。（如果大家有兴趣，后面可能也会涉及react源码的分析）但是vue中的事件似乎没有这种特殊说明，我们可以写成`@click="onClick"`或`@click="onClick()"`都能顺利执行。

那么`@click="onClick"`和`@click="onClick()"`到底有什么区别呢？按照国际惯例，我们就从源码入手，分析一下。

> vue@2.6.10 版本为例

## 编译template

我们知道，我们在vue文件中写的template都是会先经过编译的，所以先找到最全的打包入口文件`entry-runtime-with-compiler.js`,只保留了部分需要理解的代码：
```js
Vue.prototype.$mount = function() {
    if (template) {
        const { render, staticRenderFns } = compileToFunctions(template, {
            outputSourceRange: process.env.NODE_ENV !== 'production',
            shouldDecodeNewlines,
            shouldDecodeNewlinesForHref,
            delimiters: options.delimiters,
            comments: options.comments
        }, this)
        options.render = render
        options.staticRenderFns = staticRenderFns
    }
}
```
我们可以看到，当`$mount(el)`时，如果`template`存在，则会进行编译然后生成render函数。然后再看看`compileToFunctions`里具体都做了什么：
```js
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
    // 生成ast
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```
很显然，`generate`这个函数应该和我们今天的问题有很大关系，再看下 `generate`这个函数做了什么

```js
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}
// 优化掉了部分代码
export function genElement (el: ASTElement, state: CodegenState): string {
    // component or element
    let code
    if (el.component) {
      code = genComponent(el.component, el, state)
    } else {
      let data
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        data = genData(el, state)
      }

      const children = el.inlineTemplate ? null : genChildren(el, state, true)
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
    // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code)
    }
    return code
  
}
// 优化掉了部分代码
export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'
  // event handlers
  if (el.events) {
    data += `${genHandlers(el.events, false)},`
  }
  return data
}

const modifierCode: { [key: string]: string } = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard(`$event.target !== $event.currentTarget`),
  ctrl: genGuard(`!$event.ctrlKey`),
  shift: genGuard(`!$event.shiftKey`),
  alt: genGuard(`!$event.altKey`),
  meta: genGuard(`!$event.metaKey`),
  left: genGuard(`'button' in $event && $event.button !== 0`),
  middle: genGuard(`'button' in $event && $event.button !== 1`),
  right: genGuard(`'button' in $event && $event.button !== 2`)
}

export function genHandlers (
  events: ASTElementHandlers,
  isNative: boolean
): string {
  const prefix = isNative ? 'nativeOn:' : 'on:'
  let staticHandlers = ``
  let dynamicHandlers = ``
  for (const name in events) {
    const handlerCode = genHandler(events[name])
    if (events[name] && events[name].dynamic) {
      dynamicHandlers += `${name},${handlerCode},`
    } else {
      staticHandlers += `"${name}":${handlerCode},`
    }
  }
  staticHandlers = `{${staticHandlers.slice(0, -1)}}`
  if (dynamicHandlers) {
    return prefix + `_d(${staticHandlers},[${dynamicHandlers.slice(0, -1)}])`
  } else {
    return prefix + staticHandlers
  }
}
// 优化部分代码
function genHandler (handler: ASTElementHandler | Array<ASTElementHandler>): string {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return `[${handler.map(handler => genHandler(handler)).join(',')}]`
  }

  const isMethodPath = simplePathRE.test(handler.value)
  const isFunctionExpression = fnExpRE.test(handler.value)
  const isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''))

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value
    }
    return `function($event){${
      isFunctionInvocation ? `return ${handler.value}` : handler.value
    }}` // inline statement
  } else {
    let code = ''
    let genModifierCode = ''
    const keys = []
    for (const key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key]
        // left/right
        if (keyCodes[key]) {
          keys.push(key)
        }
      } else if (key === 'exact') {
        const modifiers: ASTModifiers = (handler.modifiers: any)
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(keyModifier => !modifiers[keyModifier])
            .map(keyModifier => `$event.${keyModifier}Key`)
            .join('||')
        )
      } else {
        keys.push(key)
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys)
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode
    }
    const handlerCode = isMethodPath
      ? `return ${handler.value}($event)`
      : isFunctionExpression
        ? `return (${handler.value})($event)`
        : isFunctionInvocation
          ? `return ${handler.value}`
          : handler.value
    return `function($event){${code}${handlerCode}}`
  }
}
```

我们可以看到事件是在 `genHandler`这个函数中组装的，判断是否有`modifierCode`里定义的修饰符，如果有则增加修饰符定义的代码。如果是 `isMethodPath`即`@click="onClick"`这种写法，则直接返回内容，如果是`isFunctionInvocation`即`@click="onClick()"`这种写法，则返回`function($event){ return ${handler.value} }`。同理，如果有修饰符写法，则会将修饰符map中的特定代码添加到事件中，然后再根据我们写的事件格式进行返回。

下面是不带修饰符和带修饰符的几种不同事件写法的事件编译结果：

- @click="onClick"

```js
{on:{"click":onClick}
```

- @click="onClick()"

```js
{on: { "click": "function($event){return onClick()}" }}
```

- @click.stop="onClick"

```js
{ on: { "click": "function($event){$event.stopPropagation();return onClick($event)}" } }
```

- @click.stop="onClick()"

```js
{ on: { "click": "function($event){$event.stopPropagation();return onClick()}" } }
```


现在知道为什么当我们需要给事件手动传递参数时，如果想要使用该事件的默认事件参数，需要手动传递`$event`参数了吧！

