module.exports = (sequelize, DataTypes) => {
    const game_Key = sequelize.define('GameKeys', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_sold: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        secret_key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        sold_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: true
    })

    return game_Key
}