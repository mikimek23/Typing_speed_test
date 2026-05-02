import express from 'express'
import { errorHandler } from './middlewares/error.middleware.js'
import userRouter from './routes/auth.routes.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.get('/api/health', (req, res) => {
  res.json({
    message: 'OK',
    data: { status: 'healthy' },
  })
})
app.use('/api/auth', userRouter)
app.use(errorHandler)
export default app
