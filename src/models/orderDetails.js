module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define('OrderDetail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        game_key_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        subtotal: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    })

    return OrderDetail
}
