const router = require('koa-router')();
const passport = require('koa-passport');
const hostUrl = require('./utils/HostUrl');
const UserService = require('./service/UserService');
const PictureService = require('./service/PictureService');
var CryptoJS = require("crypto-js");


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

    // Decrypt
    const username_bytes = CryptoJS.AES.decrypt(fields.username, 'username_key');
    const username_deciphered = username_bytes.toString(CryptoJS.enc.Utf8);

    const email_bytes = CryptoJS.AES.decrypt(fields.email, 'email_key');
    const email_deciphered = email_bytes.toString(CryptoJS.enc.Utf8);

    const password_bytes = CryptoJS.AES.decrypt(fields.password, 'password_key');
    const password_deciphered = password_bytes.toString(CryptoJS.enc.Utf8);

    ctx.response.body = await UserService.addUser({
        username: username_deciphered,
        password: password_deciphered,
        email: email_deciphered
    });

});


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
    ctx.response.body = {imgUrlList: imgUrlList, message: "success"};
});


/**
 *
 * clear the uploaded pics session
 *
 */
router.get('/clearUploadSession', ctx => {
    ctx.session.imgUrlList = [];
    ctx.response.body = {imgUrlList: [], message: "success"};
});


/**
 *
 * initialize the pics
 *
 */
router.get('/picInit', async ctx => {
    ctx.response.body = {imgList: await PictureService.getAllPics()};
});


/**
 *
 * get pics by tag
 *
 */
router.post('/getPicsByTag', async ctx => {
    let fields = ctx.request.body;
    ctx.response.body = await PictureService.getPicsByTag(fields.tag);
});


/**
 *
 * sort pics
 *
 */
router.post('/sort', async ctx => {
    let fields = ctx.request.body;
    if (fields.sortWay === 'popular') {
        ctx.response.body = await PictureService.sortByPopularityDesc();
    }
    else if (fields.sortWay === 'newest') {
        ctx.response.body = await PictureService.sortByCreationDateDesc();
    }
    else {
        ctx.response.body = {imgList: await PictureService.getAllPics()};
    }
});


/**
 *
 * add certain pic's visited times
 *
 */
router.post('/addPopularity', async ctx => {
    let fields = ctx.request.body;
    ctx.response.body = {picture: await PictureService.addPopularity(fields.url)};
});


/**
 *
 * add a new tag
 *
 */
router.post('/addTag', async ctx => {
    let fields = ctx.request.body;
    ctx.response.body = {newTag: await PictureService.addTag(fields.url, fields.newTag)};
});


/**
 *
 * get all tags and their visited times
 *
 */
router.get('/seeAllTags', async ctx => {
    ctx.response.body = {tagDic: await PictureService.seeAllTags()};
});

module.exports = router;