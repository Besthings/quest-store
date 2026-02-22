const {Sequelize, DataTypes} = require('sequelize')
const path = require('path')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '..', 'database', 'database.sqlite')
});

const Users = require('./usersModel')(sequelize, DataTypes)
const Orders = require('./ordersModel')(sequelize, DataTypes)

Users.hasMany(Orders, {
  foreignKey: 'user_id',
  as: 'orders'
})

Orders.belongsTo(Users, {
  foreignKey: 'user_id',
  as: 'user'
})


module.exports = {
  sequelize,
  Users,
  Orders
}