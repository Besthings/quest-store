module.exports = (sequelize, DataTypes) => {
    const Categories = sequelize.define('Categories', {
        cate_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true 
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        slug: {   
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
        
    }, {
        timestamps: true
    })

    Category.hasMany(Game, {
        foreignKey: 'category_id',
        as: 'games'
    });
    
    return Categories
}