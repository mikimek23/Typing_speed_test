import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

app.use('/', (req, res) => {
  console.log('it is working')
  res.end('started successfully')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
