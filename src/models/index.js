const { Sequelize, DataTypes } = require('sequelize')
const path = require('path')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '..', 'database', 'database.sqlite')
})

// 1. Users Model
const Users = require('./users')(sequelize, DataTypes)
const Orders = require('./orders')(sequelize, DataTypes)

// Users → Orders (One-to-Many)
Users.hasMany(Orders, {
  foreignKey: 'user_id',
  as: 'orders'
})
Orders.belongsTo(Users, {
  foreignKey: 'user_id',
  as: 'user'
})

// 2. Categories Model
const Categories = require('./categories')(sequelize, DataTypes)
const Games = require('./games')(sequelize, DataTypes)

// Categories → Games (One-to-Many)
Categories.hasMany(Games, {
  foreignKey: 'category_id',
  as: 'games'
})
Games.belongsTo(Categories, {
  foreignKey: 'category_id',
  as: 'category'
})

// 3. Games → Game_Keys (One-to-Many)
const Game_Keys = require('./gameKeys')(sequelize, DataTypes)

Games.hasMany(Game_Keys, {
  foreignKey: 'game_id', 
  as: 'keys'
})
Game_Keys.belongsTo(Games, {
  foreignKey: 'game_id',
  as: 'game'
})

// 4. Orders → Order_Details (One-to-Many)
const Order_Details = require('./orderDetails')(sequelize, DataTypes)

Orders.hasMany(Order_Details, {
  foreignKey: 'order_id',
  as: 'orderDetails'
})
Order_Details.belongsTo(Orders, {
  foreignKey: 'order_id',
  as: 'order'
})

// 5. Games → Order_Details (One-to-Many)
Games.hasMany(Order_Details, {
  foreignKey: 'game_id',
  as: 'orderDetails'
})
Order_Details.belongsTo(Games, {
  foreignKey: 'game_id',
  as: 'game'
})

// 6. Order_Details ↔ Game_Keys (One-to-One)
Game_Keys.hasOne(Order_Details, {
  foreignKey: 'game_key_id',
  as: 'orderDetail'
})
Order_Details.belongsTo(Game_Keys, {
  foreignKey: 'game_key_id',
  as: 'gameKey'
})

module.exports = {
  sequelize,
  Users,
  Categories,
  Games,
  Orders,
  Order_Details,
  Game_Keys
}
