import app from './app.js'
import path from 'node:path'
import dotenv from 'dotenv'
import { getEnv, validateEnv } from './config/env.js'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

validateEnv()

const env = getEnv()
app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`)
})
