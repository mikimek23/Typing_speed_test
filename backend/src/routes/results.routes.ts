import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { resultSchema } from '../schemas/result.schema.js'
import {
  deleteResultController,
  getResultByIdController,
  getResultController,
  saveResultController,
} from '../controllers/results.controller.js'

const resultRouter = express.Router()

resultRouter.post(
  '/',
  authMiddleware,
  validate(resultSchema),
  saveResultController,
)
resultRouter.get('/', authMiddleware, getResultController)
resultRouter.get('/:id', authMiddleware, getResultByIdController)
resultRouter.delete('/:id', authMiddleware, deleteResultController)

export default resultRouter
