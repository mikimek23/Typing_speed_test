import { asyncHandler } from '../utils/asyncHandler.js'
import {
  addDefaultTextService,
  addTextService,
  deleteMyTextService,
  getDefaultTextsService,
  getMyTextsService,
  updateMyTextService,
} from '../services/texts.service.js'
import { AppError } from '../utils/AppError.js'

export const getDefaultTextsController = asyncHandler(async (req, res) => {
  const texts = await getDefaultTextsService(req.query.difficulty)
  res.status(200).json(texts)
})
export const addDefaultTextController = asyncHandler(async (req, res) => {
  const texts = await addDefaultTextService(req.body)
  res.status(201).json(texts)
})

export const addTextController = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401)
  }
  const texts = await addTextService(req.body, req.user?.id)
  res.status(201).json(texts)
})
export const getMyTextsController = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401)
  }
  const texts = await getMyTextsService(req.query.difficulty, req.user.id)
  res.status(200).json(texts)
})
export const updateMyTextController = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401)
  }
  const text_id = req.params.id

  if (Array.isArray(text_id)) {
    throw new AppError('Invalid text id', 400)
  }
  await updateMyTextService(req.body, text_id, req.user.id)
  res.status(200).json({ message: 'Updated successfully' })
})
export const deleteMyTextController = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401)
  }
  const text_id = req.params.id

  if (Array.isArray(text_id)) {
    throw new AppError('Invalid text id', 400)
  }
  await deleteMyTextService(text_id, req.user.id)
  res.status(200).json({
    message: 'Deleted successfully',
  })
})
