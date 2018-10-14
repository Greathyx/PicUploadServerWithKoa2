const Koa = require('koa');
const path = require('path');
const cors = require('koa2-cors');
const bodyParser = require('koa-body');
const session = require('koa-session');
const staticServe = require('koa-static');


//init the database config, run the code only
let db = require('./model/index');
db.sequelize.sync({force: true}).then(function () {
    console.log("Database succeed to init");
}).catch(function (err) {
    console.log("Database failed to start due to error: %s", err);
});


const app = new Koa();


// allow cross domain access
app.use(cors({
    origin: function (ctx) {
        // if (ctx.url === '/test') {
        //     return false;
        // }
        // return '*';
        return 'http://localhost:63342';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control', 'X-Requested-With'],
}));


// static file serving
// http url(e.g.): http://127.0.0.1:3000/upload_db5f2a1f91f5e26ac5958611950153fd.jpg
let imgPath = path.resolve(__dirname, '../uploads');
app.use(staticServe(imgPath));


// cookie. use session
app.keys = ['secret key'];
// session config
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
};
app.use(session(CONFIG, app));


// use koa-body
const uploadDirPath = path.resolve(__dirname, '../uploads');
const bodyParserConfig = {
    multipart: true,
    formidable: {
        uploadDir: uploadDirPath,
        keepExtensions: true
    }

};
app.use(bodyParser(bodyParserConfig));


// authentication, load passport config
const passport = require('./middleware/Authentication');
app.use(passport.initialize());
app.use(passport.session());


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