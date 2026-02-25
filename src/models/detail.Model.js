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
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    })

    OrderDetail.associate = (models) => {
        OrderDetail.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order'
        })

        OrderDetail.belongsTo(models.Game, {
            foreignKey: 'game_id',
            as: 'game'
        })
    }

    return OrderDetail
}