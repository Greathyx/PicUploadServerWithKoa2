const router = require('koa-router')();
const passport = require('koa-passport');
const hostUrl = require('./utils/HostUrl');
const UserService = require('./service/UserService');


/**
 *
 * the basic route
 *
 */
router.get('/', ctx => {
        ctx.response.body = {message: 'hello koa'};
    }
);


/**
 *
 * register route
 *
 */
router.post('/register', async ctx => {

    let fields = ctx.request.body;
    // let fields = ctx.request.body.fields;

    if (!fields.username || !fields.password || !fields.email) {
        ctx.throw(500);
    }

    let result = await UserService.addUser({username: fields.username, password: fields.password, email: fields.email});

    ctx.response.body = result;
});

module.exports = router;


/**
 *
 * login route
 *
 */
router.post('/login', ctx => {

    // if use form-data, the data passed by bodyParser is in ctx.request.body.fields
    // ctx.request.body.username = ctx.request.body.fields.username;
    // ctx.request.body.password = ctx.request.body.fields.password;

    // will automatically use the authentication method
    return passport.authenticate('local', function (err, user, info, status) {
        if (err) {
            ctx.response.body = {message: 'error'}
        }
        else if (user === false) {
            ctx.response.body = info;
            //ctx.throw(401)
        } else {
            ctx.response.body = info;
            return ctx.login(user)
        }
    })(ctx)
});


/**
 *
 * logout route
 *
 */
router.get('/logout', ctx => {
    ctx.logout();
    ctx.body = {auth: ctx.isAuthenticated(), user: ctx.state.user};
    ctx.response.body = {auth: ctx.isAuthenticated()};
});


/**
 *
 * To test if a user has logged in
 *
 * Usage: use isAuthenticated as a middleware
 *
 * @param ctx
 * @param next: the next middleware
 * @returns {*}
 */
const isAuthenticated = (ctx, next) => {
    if (ctx.isAuthenticated())
        return next();
    else {
        ctx.response.body = {
            auth: false,
            message: 'Please login first!'
        };
        ctx.throw(401);
    }
};


/**
 *
 * To test if authenticated
 *
 */
router.get('/testAuth', isAuthenticated, ctx => {
    ctx.response.body = {
        auth: true,
        message: 'You have logged in.'
    };
});


/**
 *
 * upload pictures route
 *
 * accept formData: {file[type=file]: value}
 *
 */
router.post('/uploadPics', ctx => {
    // new version of koa-body use ctx.request.files to get the files to upload
    // old version of koa-body user ctx.request.body.files to get the files to upload
    let fields = ctx.request.files;
    let imgUrlList = [];
    if (ctx.session.imgUrlList === undefined || ctx.session.imgUrlList === null) {
        ctx.session.imgUrlList = imgUrlList;
    }
    else {
        imgUrlList = ctx.session.imgUrlList;
    }

    if (fields.file1 !== undefined) {
        let absoluteUrl = fields.file1.path;
        let hostImgName = absoluteUrl.substring(absoluteUrl.lastIndexOf('/'), absoluteUrl.length);
        let imgUrl = hostUrl.ip + hostImgName;
        imgUrlList.push(imgUrl);
    }

    if (fields.file2 !== undefined) {
        let absoluteUrl = fields.file2.path;
        let hostImgName = absoluteUrl.substring(absoluteUrl.lastIndexOf('/'), absoluteUrl.length);
        let imgUrl = hostUrl.ip + hostImgName;
        imgUrlList.push(imgUrl);
    }

    if (fields.file3 !== undefined) {
        let absoluteUrl = fields.file3.path;
        let hostImgName = absoluteUrl.substring(absoluteUrl.lastIndexOf('/'), absoluteUrl.length);
        let imgUrl = hostUrl.ip + hostImgName;
        imgUrlList.push(imgUrl);
    }

    if (fields.file4 !== undefined) {
        let absoluteUrl = fields.file4.path;
        let hostImgName = absoluteUrl.substring(absoluteUrl.lastIndexOf('/'), absoluteUrl.length);
        let imgUrl = hostUrl.ip + hostImgName;
        imgUrlList.push(imgUrl);
    }

    if (fields.file5 !== undefined) {
        let absoluteUrl = fields.file5.path;
        let hostImgName = absoluteUrl.substring(absoluteUrl.lastIndexOf('/'), absoluteUrl.length);
        let imgUrl = hostUrl.ip + hostImgName;
        imgUrlList.push(imgUrl);
    }

    ctx.session.imgUrlList = imgUrlList;
    ctx.body = {imgUrlList: imgUrlList, message: "success"};
});


/**
 *
 * delete pics in database every time when opening the web page
 *
 */
router.get('/clearUploadSession', ctx => {
    ctx.session.imgUrlList = [];
    console.log(ctx.session.imgUrlList);
    ctx.body = {imgUrlList: [], message: "success"};
});
