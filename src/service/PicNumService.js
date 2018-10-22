const PicNumModel = require('../model').PicNum;


/**
 *
 * test whether the database has the entity of picture amount
 * and if not, initialize it with 0
 *
 * @returns {Promise.<*>}
 * @constructor
 */
async function initPicNum() {

    let picNum = await PicNumModel.findById(0);
    if (picNum === null || picNum === undefined) {
        picNum = await PicNumModel.create({
            num: 0
        });
    }
    return picNum;

}


/**
 *
 * add the picture amount by num
 *
 * @param num
 * @returns {Promise.<*>}
 */
async function addPicNum(num) {

    let picNum = await PicNumModel.findById(0);
    picNum.num += num;
    return picNum.save();

}


/**
 *
 * add the picture amount by num
 *
 * @param num
 * @returns {Promise.<*>}
 */
async function minusPicNum(num) {

    let picNum = await PicNumModel.findById(0);
    picNum.num -= num;
    return picNum.save();

}


module.exports = {
    initPicNum,
    addPicNum,
    minusPicNum
};