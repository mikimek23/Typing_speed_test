import { validate } from '../middlewares/validate.middleware.js'
import {
  loginController,
  logOutController,
  meController,
  registerController,
} from '../controllers/auth.controller.js'
import { createUserSchema, loginUserSchema } from '../schemas/auth.schema.js'
import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const userRouter = express.Router()
userRouter.post('/register', validate(createUserSchema), registerController)
userRouter.post('/login', validate(loginUserSchema), loginController)
userRouter.get('/me', authMiddleware, meController)
userRouter.post('/logout', logOutController)
export default userRouter
