const protectedZooKeeper = {
  id: 1,
  name: 'Dave',
  title: 'Lazy River Boat Captain',
  protected: true,
  departmentId: 1,
  createdAt: '2019-09-25T13:48:26',
  updatedAt: '2019-09-25T13:48:26',
  deletedAt: null,
}

const unprotectedZooKeeper = {
  id: 1,
  name: 'Rich',
  title: 'Chief Lion Tamer',
  protected: false,
  departmentId: 1,
  createdAt: '2019-09-25T13:48:26',
  updatedAt: '2019-09-25T13:48:26',
  deletedAt: null,
}

const zooKeeperList = [protectedZooKeeper, unprotectedZooKeeper]

module.exports = { protectedZooKeeper, unprotectedZooKeeper, zooKeeperList }
