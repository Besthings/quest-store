module.exports = (sequelize, DataTypes) => {
    const  Order_detail = sequelize.define('or_detail', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    
        
    }, {
        timestamps: true
    })

    
    return Categories
}