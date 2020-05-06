const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chai = require('chai')
const models = require('../../models')
const {
  after, afterEach, beforeEach, describe, it,
} = require('mocha')
const { animalList, protectedAnimal, unprotectedAnimal } = require('../mocks/animals')
const { protectedZooKeeper, unprotectedZooKeeper, zooKeeperList } = require('../mocks/zooKeepers')
const {
  departmentList, protectedDepartment, unprotectedDepartmentWithAnimal,
  unprotectedDepartmentWithZooKeeper, unprotectedEmptyDepartment,
} = require('../mocks/departments')
const {
  getAnimals, getAnimalById, createAnimal, deleteAnimal,
  getZooKeepers, getZooKeeperById, createZooKeeper, deleteZooKeeper,
  getDepartments, getDepartmentById, createDepartment, deleteDepartment,
} = require('../../controllers/api')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - API', () => {
  let response
  let sandbox
  let stubbedAnimalsCreate
  let stubbedAnimalsDestroy
  let stubbedAnimalsFindAll
  let stubbedAnimalsFindOne
  let stubbedDepartmentsCreate
  let stubbedDepartmentsDestroy
  let stubbedDepartmentsFindAll
  let stubbedDepartmentsFindOne
  let stubbedStatusSend
  let stubbedZooKeepersCreate
  let stubbedZooKeepersDestroy
  let stubbedZooKeepersFindAll
  let stubbedZooKeepersFindOne

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    stubbedStatusSend = sandbox.stub()

    response = {
      send: sandbox.stub(),
      status: sandbox.stub().returns({ send: stubbedStatusSend }),
      sendStatus: sandbox.stub(),
    }

    stubbedAnimalsCreate = sandbox.stub(models.Animals, 'create')
    stubbedAnimalsDestroy = sandbox.stub(models.Animals, 'destroy')
    stubbedAnimalsFindAll = sandbox.stub(models.Animals, 'findAll')
    stubbedAnimalsFindOne = sandbox.stub(models.Animals, 'findOne')

    stubbedDepartmentsCreate = sandbox.stub(models.Departments, 'create')
    stubbedDepartmentsDestroy = sandbox.stub(models.Departments, 'destroy')
    stubbedDepartmentsFindAll = sandbox.stub(models.Departments, 'findAll')
    stubbedDepartmentsFindOne = sandbox.stub(models.Departments, 'findOne')

    stubbedZooKeepersCreate = sandbox.stub(models.ZooKeepers, 'create')
    stubbedZooKeepersDestroy = sandbox.stub(models.ZooKeepers, 'destroy')
    stubbedZooKeepersFindAll = sandbox.stub(models.ZooKeepers, 'findAll')
    stubbedZooKeepersFindOne = sandbox.stub(models.ZooKeepers, 'findOne')
  })

  after(() => {
    sandbox.reset()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('Animals', () => {
    describe('getAnimals', () => {
      it('returns a list of animals cleaned for the API', async () => {
        stubbedAnimalsFindAll.returns(animalList)

        await getAnimals({}, response)

        expect(stubbedAnimalsFindAll).to.have.been.calledWith({ include: [{ model: models.Departments }] })
        expect(response.send).to.have.been.calledWith(animalList)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedAnimalsFindAll.throws('ERROR!')

        await getAnimals({}, response)

        expect(stubbedAnimalsFindAll).to.have.been.calledWith({ include: [{ model: models.Departments }] })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown error while retrieving animals')
      })
    })

    describe('getAnimalById', () => {
      it('returns the animal associated with the id passed in', async () => {
        stubbedAnimalsFindOne.returns(protectedAnimal)

        const request = { params: { id: 1 } }

        await getAnimalById(request, response)

        expect(stubbedAnimalsFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [{ model: models.Departments }],
        })
        expect(response.send).to.have.been.calledWith(protectedAnimal)
      })

      it('returns a 404 when no animal can be found for the id passed in', async () => {
        stubbedAnimalsFindOne.returns(null)

        const request = { params: { id: 1 } }

        await getAnimalById(request, response)

        expect(stubbedAnimalsFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [{ model: models.Departments }],
        })
        expect(response.sendStatus).to.have.been.calledWith(404)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedAnimalsFindOne.throws('ERROR!')

        const request = { params: { id: 1 } }

        await getAnimalById(request, response)

        expect(stubbedAnimalsFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [{ model: models.Departments }],
        })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown error while retrieving animal')
      })
    })

    describe('createAnimal', () => {
      it('returns a 201 with the new animal when created', async () => {
        stubbedAnimalsCreate.returns(unprotectedAnimal)

        const request = { body: { name: 'Pedro', species: 'Python', departmentId: 1 } }

        await createAnimal(request, response)

        expect(stubbedAnimalsCreate).to.have.been.calledWith({ name: 'Pedro', species: 'Python', departmentId: 1 })
        expect(response.status).to.have.been.calledWith(201)
        expect(stubbedStatusSend).to.have.been.calledWith(unprotectedAnimal)
      })

      it('returns a 400 when missing data', async () => {
        const request = { body: { species: 'Python' } }

        await createAnimal(request, response)

        expect(stubbedAnimalsCreate).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(400)
        expect(stubbedStatusSend).to.have.been
          .calledWith('The following attributes are required: name, species, departmentId')
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedAnimalsCreate.throws('ERROR!')

        const request = { body: { name: 'Pedro', species: 'Python', departmentId: 1 } }

        await createAnimal(request, response)

        expect(stubbedAnimalsCreate).to.have.been.calledWith({ name: 'Pedro', species: 'Python', departmentId: 1 })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown error while creating new animal')
      })
    })

    describe('deleteAnimal', () => {
      it('responds with a success message when the animal is deleted', async () => {
        stubbedAnimalsFindOne.returns(unprotectedAnimal)

        const request = { params: { id: 1 } }

        await deleteAnimal(request, response)

        expect(stubbedAnimalsFindOne).to.have.been.calledWith({ where: { id: 1 } })
        expect(stubbedAnimalsDestroy).to.have.been.calledWith({ where: { id: 1 } })
        expect(response.send).to.have.been.calledWith('Successfully deleted the animal with ID: 1')
      })

      it('responds with a 404 when no animal can be found with the id passed in', async () => {
        stubbedAnimalsFindOne.returns(null)

        const request = { params: { id: 1 } }

        await deleteAnimal(request, response)

        expect(stubbedAnimalsFindOne).to.have.been.calledWith({ where: { id: 1 } })
        expect(stubbedAnimalsDestroy).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(404)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown animal with ID: 1')
      })

      it('responds with a 409 when the animal cannot be deleted because it is marked as protected', async () => {
        stubbedAnimalsFindOne.returns(protectedAnimal)

        const request = { params: { id: 1 } }

        await deleteAnimal(request, response)

        expect(stubbedAnimalsFindOne).to.have.been.calledWith({ where: { id: 1 } })
        expect(stubbedAnimalsDestroy).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(409)
        expect(stubbedStatusSend).to.have.been.calledWith('Cannot delete protected animals')
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedAnimalsFindOne.returns(unprotectedAnimal)
        stubbedAnimalsDestroy.throws('ERROR!')

        const request = { params: { id: 1 } }

        await deleteAnimal(request, response)

        expect(stubbedAnimalsDestroy).to.have.been.calledWith({ where: { id: 1 } })
        expect(stubbedAnimalsDestroy).to.have.been.calledWith({ where: { id: 1 } })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown error while deleting animal')
      })
    })
  })

  describe('ZooKeepers', () => {
    describe('getZooKeepers', () => {
      it('returns a list of zoo keepers cleaned for the API', async () => {
        stubbedZooKeepersFindAll.returns(zooKeeperList)

        await getZooKeepers({}, response)

        expect(stubbedZooKeepersFindAll).to.have.been.calledWith({ include: [{ model: models.Departments }] })
        expect(response.send).to.have.been.calledWith(zooKeeperList)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedZooKeepersFindAll.throws('ERROR!')

        await getZooKeepers({}, response)

        expect(stubbedZooKeepersFindAll).to.have.been.calledWith({ include: [{ model: models.Departments }] })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown error while retrieving zoo keepers')
      })
    })

    describe('getZooKeeperById', () => {
      it('returns the zoo keeper associated with the id passed in', async () => {
        stubbedZooKeepersFindOne.returns(unprotectedZooKeeper)

        const request = { params: { id: 1 } }

        await getZooKeeperById(request, response)

        expect(stubbedZooKeepersFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [{ model: models.Departments }],
        })
        expect(response.send).to.have.been.calledWith(unprotectedZooKeeper)
      })

      it('returns a 404 when no zoo keeper can be found for the id passed in', async () => {
        stubbedZooKeepersFindOne.returns(null)

        const request = { params: { id: 1 } }

        await getZooKeeperById(request, response)

        expect(stubbedZooKeepersFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [{ model: models.Departments }],
        })
        expect(response.sendStatus).to.have.been.calledWith(404)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedZooKeepersFindOne.throws('ERROR!')

        const request = { params: { id: 1 } }

        await getZooKeeperById(request, response)

        expect(stubbedZooKeepersFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [{ model: models.Departments }],
        })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown error while retrieving zoo keeper')
      })
    })

    describe('createZooKeeper', () => {
      it('returns a 201 with the new zoo keeper when created', async () => {
        stubbedZooKeepersCreate.returns(unprotectedZooKeeper)

        const request = { body: { name: 'Rich', title: 'Chief Lion Tamer', departmentId: 1 } }

        await createZooKeeper(request, response)

        expect(stubbedZooKeepersCreate).to.have.been.calledWith({
          name: 'Rich', title: 'Chief Lion Tamer', departmentId: 1
        })
        expect(response.status).to.have.been.calledWith(201)
        expect(stubbedStatusSend).to.have.been.calledWith(unprotectedZooKeeper)
      })

      it('returns a 400 when missing data', async () => {
        const request = { body: { title: 'Chief Lion Tamer' } }

        await createZooKeeper(request, response)

        expect(stubbedZooKeepersCreate).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(400)
        expect(stubbedStatusSend).to.have.been
          .calledWith('The following attributes are required: name, title, departmentId')
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedZooKeepersCreate.throws('ERROR!')

        const request = { body: { name: 'Rich', title: 'Chief Lion Tamer', departmentId: 1 } }

        await createZooKeeper(request, response)

        expect(stubbedZooKeepersCreate).to.have.been.calledWith({
          name: 'Rich', title: 'Chief Lion Tamer', departmentId: 1
        })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown error while creating new zoo keeper')
      })
    })

    describe('deleteZooKeeper', () => {
      it('responds with a success message when the zoo keeper is deleted', async () => {
        stubbedZooKeepersFindOne.returns(unprotectedZooKeeper)

        const request = { params: { id: 1 } }

        await deleteZooKeeper(request, response)

        expect(stubbedZooKeepersFindOne).to.have.been.calledWith({ where: { id: 1 } })
        expect(stubbedZooKeepersDestroy).to.have.been.calledWith({ where: { id: 1 } })
        expect(response.send).to.have.been.calledWith('Successfully deleted the zoo keeper with ID: 1')
      })

      it('responds with a 404 when no zoo keeper can be found with the id passed in', async () => {
        stubbedZooKeepersFindOne.returns(null)

        const request = { params: { id: 1 } }

        await deleteZooKeeper(request, response)

        expect(stubbedZooKeepersFindOne).to.have.been.calledWith({ where: { id: 1 } })
        expect(stubbedZooKeepersDestroy).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(404)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown zoo keeper with ID: 1')
      })

      it('responds with a 409 when the zoo keeper cannot be deleted because it is marked as protected', async () => {
        stubbedZooKeepersFindOne.returns(protectedZooKeeper)

        const request = { params: { id: 1 } }

        await deleteZooKeeper(request, response)

        expect(stubbedZooKeepersFindOne).to.have.been.calledWith({ where: { id: 1 } })
        expect(stubbedZooKeepersDestroy).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(409)
        expect(stubbedStatusSend).to.have.been.calledWith('Cannot delete protected zoo keepers')
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedZooKeepersFindOne.returns(unprotectedZooKeeper)
        stubbedZooKeepersDestroy.throws('ERROR!')

        const request = { params: { id: 1 } }

        await deleteZooKeeper(request, response)

        expect(stubbedZooKeepersFindOne).to.have.been.calledWith({ where: { id: 1 } })
        expect(stubbedZooKeepersDestroy).to.have.been.calledWith({ where: { id: 1 } })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown error while deleting zoo keeper')
      })
    })
  })

  describe('Departments', () => {
    describe('getDepartments', () => {
      it('returns a list of departments cleaned for the API', async () => {
        stubbedDepartmentsFindAll.returns(departmentList)

        await getDepartments({}, response)

        expect(stubbedDepartmentsFindAll).to.have.callCount(1)
        expect(response.send).to.have.been.calledWith(departmentList)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedDepartmentsFindAll.throws('ERROR!')

        await getDepartments({}, response)

        expect(stubbedDepartmentsFindAll).to.have.callCount(1)
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown error while retrieving departments')
      })
    })

    describe('getDepartmentById', () => {
      it('returns the department associated with the id passed in', async () => {
        stubbedDepartmentsFindOne.returns(protectedDepartment)

        const request = { params: { id: 1 } }

        await getDepartmentById(request, response)

        expect(stubbedDepartmentsFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [
            { model: models.Animals },
            { model: models.ZooKeepers },
          ],
        })
        expect(response.send).to.have.been.calledWith(protectedDepartment)
      })

      it('returns a 404 when no department can be found for the id passed in', async () => {
        stubbedDepartmentsFindOne.returns(null)

        const request = { params: { id: 1 } }

        await getDepartmentById(request, response)

        expect(stubbedDepartmentsFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [
            { model: models.Animals },
            { model: models.ZooKeepers },
          ],
        })
        expect(response.sendStatus).to.have.been.calledWith(404)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedDepartmentsFindOne.throws('ERROR!')

        const request = { params: { id: 1 } }

        await getDepartmentById(request, response)

        expect(stubbedDepartmentsFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [
            { model: models.Animals },
            { model: models.ZooKeepers },
          ],
        })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown error while retrieving department')
      })
    })

    describe('createDepartment', () => {
      it('returns a 201 with the new department when created', async () => {
        stubbedDepartmentsFindOne.returns(null)
        stubbedDepartmentsCreate.returns(unprotectedEmptyDepartment)

        const request = { body: { name: 'Concessions' } }

        await createDepartment(request, response)

        expect(stubbedDepartmentsFindOne).to.have.been.calledWith({ where: { name: 'Concessions' } })
        expect(stubbedDepartmentsCreate).to.have.been.calledWith({ name: 'Concessions' })
        expect(response.status).to.have.been.calledWith(201)
        expect(stubbedStatusSend).to.have.been.calledWith(unprotectedEmptyDepartment)
      })

      it('returns a 400 when missing data', async () => {
        const request = { body: {} }

        await createDepartment(request, response)

        expect(stubbedDepartmentsFindOne).to.have.callCount(0)
        expect(stubbedDepartmentsCreate).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(400)
        expect(stubbedStatusSend).to.have.been.calledWith('The following attributes are required: name')
      })

      it('returns a 409 when a department of that same name already exists', async () => {
        stubbedDepartmentsFindOne.returns(unprotectedEmptyDepartment)

        const request = { body: { name: 'Concessions' } }

        await createDepartment(request, response)

        expect(stubbedDepartmentsFindOne).to.have.been.calledWith({ where: { name: 'Concessions' } })
        expect(stubbedDepartmentsCreate).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(409)
        expect(stubbedStatusSend).to.have.been.calledWith('A department with that name already exists')
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedDepartmentsFindOne.returns(null)
        stubbedDepartmentsCreate.throws('ERROR!')

        const request = { body: { name: 'Concessions' } }

        await createDepartment(request, response)

        expect(stubbedDepartmentsFindOne).to.have.been.calledWith({ where: { name: 'Concessions' } })
        expect(stubbedDepartmentsCreate).to.have.been.calledWith({ name: 'Concessions' })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown error while creating new department')
      })
    })

    describe('deleteDepartment', () => {
      it('responds with a success message when the department is deleted', async () => {
        stubbedDepartmentsFindOne.returns(unprotectedEmptyDepartment)

        const request = { params: { id: 1 } }

        await deleteDepartment(request, response)

        expect(stubbedDepartmentsFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [
            { model: models.Animals },
            { model: models.ZooKeepers },
          ],
        })
        expect(stubbedDepartmentsDestroy).to.have.been.calledWith({ where: { id: 1 } })
        expect(response.send).to.have.been.calledWith('Successfully deleted the department with ID: 1')
      })

      it('responds with a 404 when no department can be found with the id passed in', async () => {
        stubbedDepartmentsFindOne.returns(null)

        const request = { params: { id: 1 } }

        await deleteDepartment(request, response)

        expect(stubbedDepartmentsFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [
            { model: models.Animals },
            { model: models.ZooKeepers },
          ],
        })
        expect(stubbedDepartmentsDestroy).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(404)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown department with ID: 1')
      })

      it('responds with a 409 when the department cannot be deleted because it is marked as protected', async () => {
        stubbedDepartmentsFindOne.returns(protectedDepartment)

        const request = { params: { id: 1 } }

        await deleteDepartment(request, response)

        expect(stubbedDepartmentsFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [
            { model: models.Animals },
            { model: models.ZooKeepers },
          ],
        })
        expect(stubbedDepartmentsDestroy).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(409)
        expect(stubbedStatusSend).to.have.been.calledWith('Cannot delete protected departments')
      })

      it('returns a 409 when department cannot be deleted because it has an animal associated with it', async () => {
        stubbedDepartmentsFindOne.returns(unprotectedDepartmentWithAnimal)

        const request = { params: { id: 1 } }

        await deleteDepartment(request, response)

        expect(stubbedDepartmentsFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [
            { model: models.Animals },
            { model: models.ZooKeepers },
          ],
        })
        expect(stubbedDepartmentsDestroy).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(409)
        expect(stubbedStatusSend).to.have.been
          .calledWith('Cannot delete departments that have animals or zoo keepers in them')
      })

      // eslint-disable-next-line max-len
      it('returns a 409 when department cannot be deleted because it has an zoo keeper associated with it', async () => {
        stubbedDepartmentsFindOne.returns(unprotectedDepartmentWithZooKeeper)

        const request = { params: { id: 1 } }

        await deleteDepartment(request, response)

        expect(stubbedDepartmentsFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [
            { model: models.Animals },
            { model: models.ZooKeepers },
          ],
        })
        expect(stubbedDepartmentsDestroy).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(409)
        expect(stubbedStatusSend).to.have.been
          .calledWith('Cannot delete departments that have animals or zoo keepers in them')
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedDepartmentsFindOne.returns(unprotectedEmptyDepartment)
        stubbedDepartmentsDestroy.throws('ERROR!')

        const request = { params: { id: 1 } }

        await deleteDepartment(request, response)

        expect(stubbedDepartmentsFindOne).to.have.been.calledWith({
          where: { id: 1 },
          include: [
            { model: models.Animals },
            { model: models.ZooKeepers },
          ],
        })
        expect(stubbedDepartmentsDestroy).to.have.been.calledWith({ where: { id: 1 } })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusSend).to.have.been.calledWith('Unknown error while deleting department')
      })
    })
  })
})
