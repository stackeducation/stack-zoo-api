const protectedAnimal = {
  id: 1,
  name: 'Timmy',
  species: 'Tiger',
  protected: true,
  departmentId: 1,
  createdAt: '2019-09-25T13:48:26',
  updatedAt: '2019-09-25T13:48:26',
  deletedAt: null,
}

const unprotectedAnimal = {
  id: 1,
  name: 'Pedro',
  species: 'Python',
  protected: false,
  departmentId: 1,
  createdAt: '2019-09-25T13:48:26',
  updatedAt: '2019-09-25T13:48:26',
  deletedAt: null,
}

const animalList = [protectedAnimal, unprotectedAnimal]

module.exports = { animalList, protectedAnimal, unprotectedAnimal }
