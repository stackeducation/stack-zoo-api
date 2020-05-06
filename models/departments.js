const Departments = (connection, Sequelize) => connection.define('departments', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING, allowNull: false, unique: true },
  protected: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
}, { paranoid: true })

module.exports = Departments
