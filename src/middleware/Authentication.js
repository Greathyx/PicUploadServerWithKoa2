const passport = require('koa-passport');
var LocalStrategy = require('passport-local').Strategy;
const UserService = require('../service/UserService');

// const fetchUser = (() => {
//     // This is an example! Use password hashing in your
//     const user = {id: 1, username: 'test', password: 'test'};
//     return async function () {
//         return user
//     }
// })();

/**
 *
 * when use ctx.login(), the method will be called
 *
 */
passport.serializeUser(function (user, done) {
    // console.log('serializeUser: ', user);
    done(null, user.id)
});

/**
 *
 * when {"id":"xxx"} in session, the method will be called
 *
 */
passport.deserializeUser(async function (id, done) {
    try {
        // const user = await fetchUser();
        const user = await UserService.getUserById(id);
        done(null, user)
    } catch (err) {
        done(err)
    }
    // console.log('deserializeUser: ', id);
});

/**
 *
 * the authentication method
 *
 */
passport.use(new LocalStrategy({
        // usernameField: 'email',
        // passwordField: 'password'
    },
    function (username, password, done) {
        UserService.verifyPassword({loginName: username, password: password})
            .then(result => {
                if (result.message === 'success') {
                    done(null, result.user, result)
                } else {
                    done(null, false, result)
                }
            })
            .catch(err => done(err))
    }));

module.exports = passport;