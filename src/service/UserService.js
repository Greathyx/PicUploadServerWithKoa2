const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const UserModel = require('../model').User;

/**
 * user:{
 *      username: string
 *      password: string
 *      email: string
 * }
 *
 * return:
 *      message:
 *      occupied_username: the username is occupied
 *      occupied_email: the email is occupied
 *      success: succeed to register
 *      error: something goes wrong
 *
 */
async function addUser(user) {
    // expecting a massive dataSet from the DB,
    // and don't want to spend the time building DAOs for each entry
    // So pass an extra query option to get the raw data instead:
    let u1 = await UserModel.findOne({where: {username: user.username}, raw: true});
    let u2 = await UserModel.findOne({where: {email: user.email}, raw: true});

    if (u1 !== null) {
        return {message: 'occupied_username'};
    }
    else if (u2 !== null) {
        return {message: 'occupied_email'};
    }
    else if (u1 === null && u2 === null) {
        await UserModel.create({
            username: user.username,
            password: user.password,
            email: user.email
        });
        return {message: 'success'};
    }
    else {
        return {message: 'error'};
    }
}

/**
 *
 * you can login with username or email
 *
 * param:{
 *      loginName:string (username or email)
 *      password:string
 * }
 *
 * return: {
 *
 *      message: success || passwordErr || noUser
 *      user: user instance if 'success || null if 'passwordErr' or 'noUser'
 * }
 *
 *
 */
async function verifyPassword(param) {

    let u1 = await UserModel.findOne({
        where: {[Op.or]: [{username: param.loginName}, {email: param.loginName}]},
        raw: true
    });

    if (u1 === null) {
        return {message: 'noUser', user: null};
    }
    else {
        if (param.password === u1.password) {
            return {message: 'success', user: u1};
        }
        else {
            return {message: 'passwordErr', user: null};
        }
    }

}

/**
 *
 * id: int
 *
 */
async function getUserById(id) {

    return await UserModel.findById(id);

}

/**
 *
 * username: string
 *
 */
async function getUserByUsername(username) {

    return await UserModel.findOne({where: {username: username}, raw: true});

}

module.exports = {
    addUser,
    verifyPassword,
    getUserById,
    getUserByUsername,
};