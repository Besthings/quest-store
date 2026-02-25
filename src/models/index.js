const {Sequelize, DataTypes} = require('sequelize')
const path = require('path')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '..', 'database', 'database.sqlite')
});

const Users = require('./usersModel')(sequelize, DataTypes)
const Orders = require('./ordersModel')(sequelize, DataTypes)
const Categories = require('./categoriesModel')(sequelize, DataTypes)
const Games = require('./gameModel')(sequelize, DataTypes)

// user -> order
Users.hasMany(Orders, {
  foreignKey: 'user_id',
  as: 'orders'
})

Orders.belongsTo(Users, {
  foreignKey: 'user_id',
  as: 'user'
})


// category -> games
Categories.hasMany(Games, {
  foreignKey: 'category_id',
  as: 'games'
})

Games.belongsTo(Categories, {
  foreignKey: 'category_id',
  as: 'category'
})



module.exports = {
  sequelize,
  Users,
  Categories,
  Orders,
  Games
}