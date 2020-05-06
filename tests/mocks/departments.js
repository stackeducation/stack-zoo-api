const protectedDepartment = {
  id: 1,
  name: 'Big Cats',
  protected: true,
  createdAt: '2020-05-05T23:26:47.000Z',
  updatedAt: '2020-05-05T23:26:47.000Z',
  deletedAt: null,
  animals: [{
    id: 1,
    name: 'Tommy',
    species: 'Tiger',
    protected: true,
    departmentId: 1,
    createdAt: '2020-05-05T23:26:47.000Z',
    updatedAt: '2020-05-05T23:26:47.000Z',
    deletedAt: null
  }],
  zooKeepers: [{
    id: 1,
    name: 'Rich DiTieri',
    title: 'Chief Lion Tamer',
    protected: true,
    departmentId: 1,
    createdAt: '2020-05-05T23:26:47.000Z',
    updatedAt: '2020-05-05T23:26:47.000Z',
    deletedAt: null
  }],
}

const unprotectedDepartmentWithAnimal = {
  id: 4,
  name: 'Small Herbivores',
  protected: false,
  createdAt: '2020-05-05T23:26:47.000Z',
  updatedAt: '2020-05-05T23:26:47.000Z',
  deletedAt: null,
  animals: [{
    id: 3,
    name: 'Penny',
    species: 'Porcupine',
    protected: true,
    departmentId: 4,
    createdAt: '2020-05-05T23:26:47.000Z',
    updatedAt: '2020-05-05T23:26:47.000Z',
    deletedAt: null
  }],
  zooKeepers: []
}

const unprotectedDepartmentWithZooKeeper = {
  id: 2,
  name: 'Executive',
  protected: false,
  createdAt: '2020-05-05T23:26:47.000Z',
  updatedAt: '2020-05-05T23:26:47.000Z',
  deletedAt: null,
  animals: [],
  zooKeepers: [{
    id: 2,
    name: 'John Rice',
    title: 'Guest Happiness Officer',
    protected: true,
    departmentId: 2,
    createdAt: '2020-05-05T23:26:47.000Z',
    updatedAt: '2020-05-05T23:26:47.000Z',
    deletedAt: null
  }],
}

const unprotectedEmptyDepartment = {
  id: 6,
  name: 'Concessions',
  protected: false,
  createdAt: '2020-05-06T00:03:48.000Z',
  updatedAt: '2020-05-06T00:03:48.000Z',
  deletedAt: null,
  animals: [],
  zooKeepers: []
}

const departmentList = [
  protectedDepartment,
  unprotectedDepartmentWithAnimal,
  unprotectedDepartmentWithZooKeeper,
  unprotectedEmptyDepartment,
]

module.exports = {
  departmentList,
  protectedDepartment,
  unprotectedDepartmentWithAnimal,
  unprotectedDepartmentWithZooKeeper,
  unprotectedEmptyDepartment,
}
