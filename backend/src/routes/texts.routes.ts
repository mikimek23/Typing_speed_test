import express from 'express'
import {
  addDefaultTextController,
  addTextController,
  deleteMyTextController,
  getDefaultTextsController,
  getMyTextsController,
  updateMyTextController,
} from '../controllers/texts.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { AddTextSchema, UpdateTextSchema } from '../schemas/text.schema.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const textsRouter = express.Router()

textsRouter.get('/default', getDefaultTextsController)
textsRouter.post('/default', validate(AddTextSchema), addDefaultTextController)
textsRouter.post(
  '/me',
  authMiddleware,
  validate(AddTextSchema),
  addTextController,
)
textsRouter.get('/me', authMiddleware, getMyTextsController)
textsRouter.put(
  '/me/:id',
  authMiddleware,
  validate(UpdateTextSchema),
  updateMyTextController,
)
textsRouter.delete('/me/:id', authMiddleware, deleteMyTextController)
export default textsRouter
