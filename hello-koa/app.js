// koa是一个class
const Koa = require('koa');
// 注意 require（koa-router）返回的是函数
// const router = require('koa-router')();
// post请求
const bodyParser = require('koa-bodyparser');
const controller=require('./controllers');
const app = new Koa();

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});
app.use(bodyParser());
app.use(controller());
// add url-route
// router.get('/hello/:name', async (ctx, next) => {
//   var name = ctx.params.name;
//   ctx.response.body = `<h1>Hello,${name}!</h1>`;
// });
// router.get('/', async (ctx, next) => {
//   ctx.response.body = `<h1>Index</h1>
//     <form action='/sigin' method='post'>
//         <p>Name:<input name='name' value='koa'/></p>
//         <p>Password:<input name='password' type='password'/></p>
//         <p><input type='submit' value='submit'/></p>
//     </form>
//     `;
// });
// router.post('/sigin', async (ctx, next) => {
//   const { request, response } = ctx;
//   const { name, password } = request.body;
//   console.log(`sigin with name:${name},password:${password}`);
//   if (name === 'koa' && password === '12345') {
//     response.body = `<h1>Welcome,${name}</h1>`;
//   } else {
//     response.body = `<h1>Login failed!</h1>
//         <p><a href='/'>Try again</a></p>`;
//   }
// });
// // add router middleware
// app.use(router.routes());
// app.use(async (ctx,next) =>{
//     if(ctx.request.path==='/test'){
//         ctx.response.body='Test page';
//     }else{
//         await next();
//     }
// });
// app.use(async (ctx,next)=>{
//     if(ctx.request.path==='/error'){
//         ctx.response.body='Error page';
//     }else{
//         await next();
//     }
// })
// 监听 端口3000；
app.listen(3000);
console.log('app started at port 3000');




