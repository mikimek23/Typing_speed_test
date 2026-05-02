import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { getEnv } from '../config/env.js'
import { AppError } from '../utils/AppError.js'

const env = getEnv()

export interface AuthRequest extends Request {
  user?: { id: string; email: string }
}

type JwtPayload = {
  id: string
  email: string
  iat?: number
  exp?: number
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new AppError('Access token is required', 401)
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError('Invalid token format', 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, env.accessTokenSecret) as JwtPayload
    req.user = {
      id: decoded.id,
      email: decoded.email,
    }
    console.log(req.user)
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', 401)
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401)
    }

    next()
  }
}
