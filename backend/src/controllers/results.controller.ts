import { resultQuerySchema } from '../schemas/result.schema.js'
import {
  deleteResultService,
  getResultByIdService,
  getResultService,
  saveResultService,
} from '../services/results.service.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const saveResultController = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401)
  }
  const result = await saveResultService(req.body, req.user.id)
  res.status(201).json(result)
})
export const getResultController = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401)
  }
  const validQuery = resultQuerySchema.parse(req.query)
  if (!validQuery) {
    throw new AppError('validation error', 400)
  }
  const result = await getResultService(req.user.id, req.query)
  res.status(200).json(result)
})
export const getResultByIdController = asyncHandler(async (req, res) => {
  const resultId = req.params.id
  if (!req.user) {
    throw new AppError('Unauthorized', 401)
  }
  if (Array.isArray(resultId)) {
    throw new AppError('Invalid result Id', 400)
  }
  const result = await getResultByIdService(resultId, req.user.id)
  res.status(200).json(result)
})
export const deleteResultController = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401)
  }
  const resultId = req.params.id
  if (Array.isArray(resultId)) {
    throw new AppError('Invalid result Id', 400)
  }
  await deleteResultService(resultId, req.user.id)
  res.status(200).json({ message: 'successfully deleted.' })
})
