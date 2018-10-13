const Koa = require('koa');


const app = new Koa();

// use router
const router = require('./router');
router.all('404', '*', ctx => {
    ctx.status = 404;
    ctx.body = '404'
});
app
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(3000);