const router = require('koa-router')();


/**
 *
 * the basic route
 *
 */
router.get('/', ctx => {
        ctx.response.body = {message: 'hello koa'};
    }
);

module.exports = router;