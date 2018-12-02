const passport = require('koa-passport');
var LocalStrategy = require('passport-local').Strategy;
const UserService = require('../service/UserService');
var CryptoJS = require("crypto-js");

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
        // Decrypt
        const username_bytes = CryptoJS.AES.decrypt(username, 'username_key');
        const username_deciphered = username_bytes.toString(CryptoJS.enc.Utf8);

        const password_bytes = CryptoJS.AES.decrypt(password, 'password_key');
        const password_deciphered = password_bytes.toString(CryptoJS.enc.Utf8);

        UserService.verifyPassword({loginName: username_deciphered, password: password_deciphered})
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