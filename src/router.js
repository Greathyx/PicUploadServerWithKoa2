const router = require('koa-router')();
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