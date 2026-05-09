import { asyncHandler } from '../utils/asyncHandler.js'
import {
  loginService,
  logOutService,
  meService,
  refreshService,
  registerService,
} from '../services/auth.service.js'
import { AppError } from '../utils/AppError.js'
import { getEnv } from '../config/env.js'
const env = getEnv()

export const registerController = asyncHandler(async (req, res) => {
  const user = await registerService(req.body)
  res.status(201).json(user)
})
export const loginController = asyncHandler(async (req, res) => {
  const response = await loginService(req.body)
  res.cookie('refreshToken', response.refreshToken, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api',
    domain: env.cookieDomain,
  })
  res.status(200).json(response)
})
export const meController = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401)
  }
  const user = await meService(req.user.id)
  res.status(200).json(user)
})

export const refreshController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken
  if (!refreshToken) {
    res.status(200).json({
      message: 'No active session',
      data: {
        accessToken: null,
        user: null,
      },
    })
    return
  }
  const session = await refreshService(refreshToken)
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api',
    domain: env.cookieDomain,
  })
  res.status(200).json({
    message: 'Access token refreshed',
    data: {
      accessToken: session.accessToken,
      user: session.user,
    },
  })
})
export const logOutController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken
  await logOutService(refreshToken)

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api',
    domain: env.cookieDomain,
  })

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
})
