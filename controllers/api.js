const models = require('../models')

const getAnimals = async (request, response) => {
  try {
    const animalList = await models.Animals.findAll({ include: [{ model: models.Departments }] })

    return response.send(animalList)
  } catch (error) {
    return response.status(500).send('Unknown error while retrieving animals')
  }
}

const getAnimalById = async (request, response) => {
  try {
    const id = parseInt(request.params.id)

    const animal = await models.Animals.findOne({
      where: { id },
      include: [{ model: models.Departments }],
    })

    return animal
      ? response.send(animal)
      : response.sendStatus(404)
  } catch (error) {
    return response.status(500).send('Unknown error while retrieving animal')
  }
}

const createAnimal = async (request, response) => {
  try {
    const { name, species, departmentId } = request.body

    if (!name || !species || !departmentId) {
      return response.status(400).send('The following attributes are required: name, species, departmentId')
    }

    const newAnimal = await models.Animals.create({ name, species, departmentId })

    return response.status(201).send(newAnimal)
  } catch (error) {
    return response.status(500).send('Unknown error while creating new animal')
  }
}

const deleteAnimal = async (request, response) => {
  try {
    const id = parseInt(request.params.id)
    const animal = await models.Animals.findOne({ where: { id } })

    if (!animal) return response.status(404).send(`Unknown animal with ID: ${id}`)

    if (animal.protected) return response.status(409).send('Cannot delete protected animals')

    await models.Animals.destroy({ where: { id } })

    return response.send(`Successfully deleted the animal with ID: ${id}`)
  } catch (error) {
    return response.status(500).send('Unknown error while deleting animal')
  }
}

const getDepartments = async (request, response) => {
  try {
    const departmentList = await models.Departments.findAll()

    return response.send(departmentList)
  } catch (error) {
    return response.status(500).send('Unknown error while retrieving departments')
  }
}

const getDepartmentById = async (request, response) => {
  try {
    const id = parseInt(request.params.id)

    const department = await models.Departments.findOne({
      where: { id },
      include: [
        { model: models.Animals },
        { model: models.ZooKeepers },
      ],
    })

    return department
      ? response.send(department)
      : response.sendStatus(404)
  } catch (error) {
    return response.status(500).send('Unknown error while retrieving department')
  }
}

const createDepartment = async (request, response) => {
  try {
    const { name } = request.body

    if (!name) return response.status(400).send('The following attributes are required: name')

    const existingDepartment = await models.Departments.findOne({ where: { name } })

    if (existingDepartment) return response.status(409).send('A department with that name already exists')

    const newDepartment = await models.Departments.create({ name })

    return response.status(201).send(newDepartment)
  } catch (error) {
    return response.status(500).send('Unknown error while creating new department')
  }
}

const deleteDepartment = async (request, response) => {
  try {
    const id = parseInt(request.params.id)
    const department = await models.Departments.findOne({
      where: { id },
      include: [
        { model: models.Animals },
        { model: models.ZooKeepers },
      ],
    })

    if (!department) return response.status(404).send(`Unknown department with ID: ${id}`)

    if (department.protected) return response.status(409).send('Cannot delete protected departments')

    if (department.animals.length || department.zooKeepers.length) {
      return response.status(409).send('Cannot delete departments that have animals or zoo keepers in them')
    }

    await models.Departments.destroy({ where: { id } })

    return response.send(`Successfully deleted the department with ID: ${id}`)
  } catch (error) {
    return response.status(500).send('Unknown error while deleting department')
  }
}

const getZooKeepers = async (request, response) => {
  try {
    const keeperList = await models.ZooKeepers.findAll({ include: [{ model: models.Departments }] })

    return response.send(keeperList)
  } catch (error) {
    return response.status(500).send('Unknown error while retrieving zoo keepers')
  }
}

const getZooKeeperById = async (request, response) => {
  try {
    const id = parseInt(request.params.id)

    const keeper = await models.ZooKeepers.findOne({
      where: { id },
      include: [{ model: models.Departments }],
    })

    return keeper
      ? response.send(keeper)
      : response.sendStatus(404)
  } catch (error) {
    return response.status(500).send('Unknown error while retrieving zoo keeper')
  }
}

const createZooKeeper = async (request, response) => {
  try {
    const { name, title, departmentId } = request.body

    if (!name || !title || !departmentId) {
      return response.status(400).send('The following attributes are required: name, title, departmentId')
    }

    const newKeeper = await models.ZooKeepers.create({ name, title, departmentId })

    return response.status(201).send(newKeeper)
  } catch (error) {
    return response.status(500).send('Unknown error while creating new zoo keeper')
  }
}

const deleteZooKeeper = async (request, response) => {
  try {
    const id = parseInt(request.params.id)
    const zookeeper = await models.ZooKeepers.findOne({ where: { id } })

    if (!zookeeper) return response.status(404).send(`Unknown zoo keeper with ID: ${id}`)

    if (zookeeper.protected) return response.status(409).send('Cannot delete protected zoo keepers')

    await models.ZooKeepers.destroy({ where: { id } })

    return response.send(`Successfully deleted the zoo keeper with ID: ${id}`)
  } catch (error) {
    return response.status(500).send('Unknown error while deleting zoo keeper')
  }
}

module.exports = {
  getAnimals,
  getAnimalById,
  createAnimal,
  deleteAnimal,
  getDepartments,
  getDepartmentById,
  createDepartment,
  deleteDepartment,
  getZooKeepers,
  getZooKeeperById,
  createZooKeeper,
  deleteZooKeeper,
}
