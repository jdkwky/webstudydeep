const fn_index=async (ctx,next)=>{
    ctx.response.body = `<h1>Index</h1>
    <form action='/signin' method='post'>
        <p>Name:<input name='name' value='koa'/></p>
        <p>Password:<input name='password' type='password'/></p>
        <p><input type='submit' value='submit'/></p>
    </form>`;
};
const fn_signin=async (ctx,next)=>{
    const { request, response } = ctx;
    const { name, password } = request.body;
    console.log(`sigin with name:${name},password:${password}`);
    if (name === 'koa' && password === '12345') {
      response.body = `<h1>Welcome,${name}</h1>`;
    } else {
      response.body = `<h1>Login failed!</h1>
          <p><a href='/'>Try again</a></p>`;
    }
};
module.exports={
    'GET /':fn_index,
    'POST /signin':fn_signin
};