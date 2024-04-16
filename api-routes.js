
const router = require('express').Router()
const { response, request } = require('express')
const { MongoClient, ObjectId } = require('mongodb')

const url = process.env.MONGODB_URI || require('./secrets/mongodb.json').url
const client = new MongoClient(url)

const getCollection = async (dbName, collectionName) => {
	await client.connect()
	return client.db(dbName).collection(collectionName)
}

// todo: add your endpoints here

// u8fGeAlqzNAJ2PYU

router.get('/movies', async (_, response) => {
    const collection = await getCollection('movie-api', 'movies')
    const movies = await collection.find().toArray()
    response.json(movies)
})

router.get('/movies/:id', async (request, response) => {
    const { id } = request.params
    const collection = await getCollection('movie-api', 'movies')
    const movie = await collection.findOne({ _id: new ObjectId(id) })
    response.json(movie)
})

router.post('/movies', async (request, response) => {
    const {body} = request
    const { title, year, director, genre } = body
    const movie = { title, year, director, genre }

    const collection = await getCollection('movie-api', 'movies')
    const result = await collection.insertOne(movie)
    response.json(result)
})

router.put('/movies/:id', async (request, response) => {
    const {body, params} = request
    const {id} = params
    const { title, year, director, genre } = body
    const movie = { title, year, director, genre }

    const collection = await getCollection('movie-api', 'movies')
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: movie })
    response.json(result)
})

router.delete('/movies/:id', async (request, response) => {
    const {id} = request.params

    const collection = await getCollection('movie-api', 'movies')
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    response.json(result)
})

router.get('/movies/genre/:genre', async (request, response) => {
    const { genre } = request.params
    const collection = await getCollection('movie-api', 'movies')
    const movies = await collection.find({ genre }).toArray()
    response.json(movies)
})

router.get('/movies/director/:director', async (request, response) => {
    const { director } = request.params
    const collection = await getCollection('movie-api', 'movies')
    const movies = await collection.find({ director }).toArray()
    response.json(movies)
})



module.exports = router