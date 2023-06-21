import 'dotenv/config.js'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import { MongoClient } from 'mongodb'

import { createConnection, createTable } from './database.js'

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())
app.use(express.json())

app.get('/check-mysql-connection', async (_req, res) => {
  await createTable()

  console.log(process.env.DATABASE_HOST)

  const conn = createConnection()

  conn.query('SELECT * FROM productos', (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Error al obtener los productos'
      })
    }

    res.json(result)
  })
})


const mongoServiceName = process.env.DATABASE_SERVICE_NAME || 'databasemongo'
const mongoURI = process.env.MONGO_URI || `mongodb://${mongoServiceName}:27017/`




// const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase'

app.get('/check-mongodb-connection', async (_req, res) => {
  try {
    const client = await MongoClient.connect(mongoURI)
    const db = client.db()
    const collection = db.collection('productos')

    const result = await collection.find().toArray()

    res.json(result)
  } catch (error) {
    console.error('Error al obtener los productos:', error)
    res.status(500).json({
      message: 'Error al obtener los productos'
    })
  }
})




app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})






