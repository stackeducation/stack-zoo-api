const Animals = (connection, Sequelize, Departments) => connection.define('animals', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING, allowNull: false },
  species: { type: Sequelize.STRING, allowNull: false },
  protected: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  departmentId: { type: Sequelize.INTEGER, references: { model: Departments, key: 'id' } },
}, { paranoid: true })

module.exports = Animals
