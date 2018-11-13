module.exports = function (sequelize, DataTypes) {

    let Picture = sequelize.define("Picture", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        url: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        tags: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        visitTimes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        createdDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    });

    return Picture;
};