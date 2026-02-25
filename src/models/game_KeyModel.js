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

    GameKey.belongsTo(Game, {
        foreignKey: 'game_id',
        as: 'game'
    });

    GameKey.belongsTo(Detail, {
        foreignKey: 'detail_id',
        as: 'detail'
    });


    return game_Key
}