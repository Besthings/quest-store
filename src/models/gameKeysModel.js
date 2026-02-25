module.exports = (sequelize, DataTypes) => {
    const game_Key = sequelize.define('Game_Key', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true

        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        Key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }

    }, {
        timestamps: true
    })



    return game_Key
}