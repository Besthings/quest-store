module.exports = (sequelize, DataTypes) => {
    const Favorites = sequelize.define('Favorites', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Games',
                key: 'id'
            }
        }
    }, {
        timestamps: true,
        // ป้องกันการ favorite ซ้ำ
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'game_id']
            }
        ]
    })

    return Favorites
}
