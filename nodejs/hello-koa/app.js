// koa是一个class
const Koa = require('koa');
const app = new Koa();
app.use(async (ctx, next) => {
  await next();
  ctx.response.type = 'text/html';
  ctx.response.body = '<h1>Hello,koa2!</h1>';
});
// 监听 端口3000；
app.listen(3000);
console.log('app started at port 3000');
