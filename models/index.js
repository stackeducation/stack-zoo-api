const Sequelize = require('sequelize')
const allConfigs = require('../config/sequelize')
const AnimalsModel = require('./animals')
const DepartmentsModel = require('./departments')
const ZooKeepersModel = require('./zooKeepers')

const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
const config = allConfigs[environment]

const connection = new Sequelize(config.database, config.username, config.password, {
  host: config.host, dialect: config.dialect,
})

const Departments = DepartmentsModel(connection, Sequelize)

const Animals = AnimalsModel(connection, Sequelize, Departments)
const ZooKeepers = ZooKeepersModel(connection, Sequelize, Departments)

Animals.belongsTo(Departments)
Departments.hasMany(Animals)

ZooKeepers.belongsTo(Departments)
Departments.hasMany(ZooKeepers)

module.exports = { Animals, Departments, ZooKeepers }
