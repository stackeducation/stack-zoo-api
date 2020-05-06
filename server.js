const bodyParser = require('body-parser')
const express = require('express')
const {
  getAnimals, getAnimalById, createAnimal, deleteAnimal,
  getZooKeepers, getZooKeeperById, createZooKeeper, deleteZooKeeper,
  getDepartments, getDepartmentById, createDepartment, deleteDepartment,
} = require('./controllers/api')

const app = express()

app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/', (request, response) => response.render('index'))

app.get('/api/animals', getAnimals)
app.get('/api/animals/:id', getAnimalById)
app.post('/api/animals', createAnimal)
app.delete('/api/animals/:id', deleteAnimal)

app.get('/api/zookeepers', getZooKeepers)
app.get('/api/zookeepers/:id', getZooKeeperById)
app.post('/api/zookeepers', createZooKeeper)
app.delete('/api/zookeepers/:id', deleteZooKeeper)

app.get('/api/departments', getDepartments)
app.get('/api/departments/:id', getDepartmentById)
app.post('/api/departments', createDepartment)
app.delete('/api/departments/:id', deleteDepartment)

app.all('*', (request, response) => response.sendStatus(404))

app.listen(1337, () => {
  console.log('Listening on port 1337...') // eslint-disable-line no-console
})
