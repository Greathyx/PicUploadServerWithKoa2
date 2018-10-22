module.exports = function (sequelize, DataTypes) {

    let Picture = sequelize.define("Picture", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        origin: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        }
    });

    return Picture;
};