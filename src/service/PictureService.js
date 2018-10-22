const PictureModel = require('../model').Picture;

/**
 * picture:{
 *      origin: string
 * }
 *
 * return:
 *      picture:{
 *      id: int
 *      origin: string
 *   }
 *
 */
async function addPicture(picture) {

    return await PictureModel.create({
        origin: picture.origin
    });

}


/**
 *
 * delete all instances in Picture table
 *
 * @returns {Promise.<void>}
 */
async function deleteAll() {

    PictureModel.truncate();

}

module.exports = {
    addPicture,
    deleteAll
};