import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
app.use(express.json())

app.use('/', (req, res) => {
  console.log('it is working')
  res.end('started successfully')
})

export default app
