const {Sequelize, DataTypes} = require('sequelize')
const path = require('path')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '..', 'database', 'database.sqlite')
});

const Users = require('./usersModel')(sequelize, DataTypes)

module.exports = {
  sequelize,
  Users
}