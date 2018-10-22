module.exports = function (sequelize, DataTypes) {

    let PicNum = sequelize.define("PicNum", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        num: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }
    });

    return PicNum;
};