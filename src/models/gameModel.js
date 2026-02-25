module.exports = (sequelize, DataTypes) => {
    const Games = sequelize.define('Games', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        stock_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }

    }, {
        
        timestamps: true,
    })


    return Games
}