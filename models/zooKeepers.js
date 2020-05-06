const ZooKeepers = (connection, Sequelize, Departments) => connection.define('zooKeepers', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING, allowNull: false },
  title: { type: Sequelize.STRING, allowNull: false },
  protected: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  departmentId: { type: Sequelize.INTEGER, references: { model: Departments, key: 'id' } },
}, { paranoid: true })

module.exports = ZooKeepers
