const PictureModel = require('../model').Picture;
const defaultPicData = require('../utils/DefaultPicData');


async function getAllPics() {

    let imgList = [];
    let allPics = await PictureModel.findAll();

    if (allPics.length === 0) {
        for (pic of defaultPicData.defaultPics) {
            await addPicture(pic);
            imgList.push(pic);
        }
        return imgList;
    }
    else {
        return allPics;
    }

}

/**
 * picture:{
 *      origin: string
 * }
 *
 * return:
 *      picture:{
 *      id: int
 *      url: string
 *      tags: string
 *   }
 *
 */
async function addPicture(picture) {

    await PictureModel.create({
        url: picture.url,
        tags: picture.tags,
        visitTimes: picture.visitTimes,
        createdDate: picture.createdDate,
    });

}


async function getPicsByTag(tag) {

    let imgList = [];
    let allPics = await PictureModel.findAll();

    for (pic of allPics) {
        if (pic.tags.search(tag) !== -1) {
            imgList.push(pic);
        }
    }

    return {imgList: imgList};

}


async function sortByPopularityDesc() {

    let allPics = await PictureModel.findAll({order: [['visitTimes', 'DESC'],]});
    return {imgList: allPics};

}


async function sortByCreationDateDesc() {

    let allPics = await PictureModel.findAll({order: [['createdDate', 'DESC'],]});
    return {imgList: allPics};

}


async function addPopularity(url) {

    let picture = await PictureModel.findOne({where: {url: url}, raw: true});
    let newVisitTimes = picture.visitTimes + 1;
    await PictureModel.update({
        visitTimes: newVisitTimes
    }, {
        where: {url: url}
    });
    picture = await PictureModel.findOne({where: {url: url}, raw: true});
    return picture;

}


async function addTag(url, newTag) {

    let picture = await PictureModel.findOne({where: {url: url}, raw: true});
    let tags = picture.tags + ',' + newTag;
    await PictureModel.update({
        tags: tags
    }, {
        where: {url: url}
    });
    picture = await PictureModel.findOne({where: {url: url}, raw: true});
    return picture.tags;

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
    getAllPics,
    getPicsByTag,
    sortByPopularityDesc,
    sortByCreationDateDesc,
    addPopularity,
    addTag,
};