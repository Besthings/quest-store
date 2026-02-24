const { ENUM } = require("sequelize")
const { mapValueFieldNames } = require("sequelize/lib/utils")
const { getImageUrlById } = require('./game.idurl');

module.exports = (sequelize, DataTypes) => {
    const games = sequelize.define('games', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true 
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        stock_quality:{
            type:DataTypes.INTEGER,
            allowNull: false
        },
        price:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discountPrice:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status:{
            type: DataTypes.ENUM,
            value: ['active', 'inactive'],
            defaultValue: 'inactive'
        },

        slug: {   
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
        
    }, {
        timestamps: true
    })

    
    

    
    return games
}