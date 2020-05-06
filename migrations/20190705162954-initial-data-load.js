module.exports = {
  up: async (queryInterface) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    await queryInterface.bulkInsert('departments', [
      { name: 'Big Cats', protected: true },
      { name: 'Executive', protected: true },
      { name: 'Reptiles', protected: true },
      { name: 'Small Herbivores', protected: true },
      { name: 'Water Mammals', protected: true },
    ])

    await queryInterface.bulkInsert('animals', [
      { name: 'Tommy', species: 'Tiger', protected: true, departmentId: 1 },
      { name: 'Olly', species: 'Otter', protected: true, departmentId: 5 },
      { name: 'Penny', species: 'Porcupine', protected: true, departmentId: 4 },
    ])

    return queryInterface.bulkInsert('zooKeepers', [
      { name: 'Rich DiTieri', title: 'Chief Lion Tamer', protected: true, departmentId: 1 },
      { name: 'John Rice', title: 'Guest Happiness Officer', protected: true, departmentId: 2 },
      { name: 'John Carmichael', title: 'Lead Reptile Wrangler', protected: true, departmentId: 3 },
    ])
  },

  down: async (queryInterface) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.bulkDelete('animals')
    await queryInterface.bulkDelete('zooKeepers')

    return queryInterface.bulkDelete('departments')
  }
}
