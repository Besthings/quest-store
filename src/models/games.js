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
            type: DataTypes.VIRTUAL,
            get() {
                // Returns count of unsold keys if keys association is loaded
                if (this.keys) {
                    return this.keys.filter(k => k.is_sold === false).length;
                }
                return 0;
            }
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        timestamps: true,
    })


    return Games
}