module.exports = (sequelize, DataTypes) => {
    const Categories = sequelize.define('Categories', {
        id: {
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


    
    return Categories
}