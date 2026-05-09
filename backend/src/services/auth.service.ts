import prisma from '../prisma/client.js'
import crypto from 'node:crypto'
import { CreateUserInput, LoginInput } from '../schemas/auth.schema.js'
import { AppError } from '../utils/AppError.js'
import { comparePassword, hashPassword } from '../utils/password.js'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js'
import { getEnv } from '../config/env.js'
import jwt from 'jsonwebtoken'
type TokenPayload = {
  id: string
  email: string
  type: 'refresh' | 'access'
  iat?: number
  exp: number
}
const verifyRefreshToken = (refreshToken: string) => {
  const env = getEnv()
  const decoded = jwt.verify(
    refreshToken,
    env.refreshTokenSecret,
  ) as TokenPayload
  return decoded
}
const hashRefreshToken = (refreshToken: string) => {
  return crypto.createHash('sha256').update(refreshToken).digest('hex')
}

export const registerService = async (data: CreateUserInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  })
  if (existingUser) {
    throw new AppError('User already exists', 409)
  }
  const hashedPassword = await hashPassword(data.password)
  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      created_at: true,
    },
  })
  return newUser
}
export const loginService = async (data: LoginInput) => {
  const foundUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  })
  if (!foundUser) {
    throw new AppError('Incorrect email or password', 401)
  }
  const isMatch = await comparePassword(data.password, foundUser.password)
  if (!isMatch) {
    throw new AppError('Incorrect email or password', 401)
  }
  const accessToken = generateAccessToken({
    id: foundUser.id,
    email: foundUser.email,
    type: 'access',
  })
  const refreshToken = generateRefreshToken({
    id: foundUser.id,
    email: foundUser.email,
    type: 'refresh',
  })
  const refreshTokenHash = hashRefreshToken(refreshToken)
  const payload = verifyRefreshToken(refreshToken)
  console.log(payload.exp)
  const user = await prisma.user.update({
    where: {
      email: foundUser.email,
    },
    data: {
      refreshTokenHash: refreshTokenHash,
      refreshTokenExpiresAt: new Date(payload.exp * 1000),
    },
    select: {
      id: true,
      name: true,
      email: true,
      created_at: true,
    },
  })
  return { user, accessToken, refreshToken }
}
export const meService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      created_at: true,
    },
  })
  if (!user) {
    throw new AppError('Not found', 404)
  }
  return user
}
export const refreshService = async (refreshToken: string) => {
  let payload
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    throw new AppError('Invalid referesh token', 403)
  }
  if (payload.type && payload.type !== 'refresh') {
    throw new AppError('Invalid token type', 403)
  }
  console.log(payload.id)
  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  })
  if (!user || !user.refreshTokenHash) {
    throw new AppError('invalid referesh token', 403)
  }
  if (
    user.refreshTokenExpiresAt &&
    user.refreshTokenExpiresAt.getTime() < Date.now()
  ) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
      },
    })
    throw new AppError('Refresh token expired', 403)
  }
  const currentHash = hashRefreshToken(refreshToken)

  if (currentHash !== user.refreshTokenHash) {
    throw new AppError('Invalid refresh token', 403)
  }

  const newAccessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    type: 'access',
  })
  const newRefreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
    type: 'refresh',
  })
  const newPayload = verifyRefreshToken(newRefreshToken)
  const hashedRefreshToken = hashRefreshToken(newRefreshToken)
  const updatedUser = await prisma.user.update({
    where: {
      id: newPayload.id,
    },
    data: {
      refreshTokenHash: hashedRefreshToken,
      refreshTokenExpiresAt: new Date(newPayload.exp * 1000),
    },
    select: {
      id: true,
      name: true,
      email: true,
      created_at: true,
    },
  })
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: updatedUser,
  }
}
export const logOutService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError('no refresh token', 401)
  }
  try {
    const payload = verifyRefreshToken(refreshToken)

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    })

    if (!user) {
      throw new AppError('Invalid refresh token', 401)
    }

    const currentHash = hashRefreshToken(refreshToken)

    if (user.refreshTokenHash !== currentHash) {
      throw new AppError('Invalid refresh token', 401)
    }
    await prisma.user.update({
      where: {
        id: payload.id,
      },
      data: {
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
      },
    })
  } catch {
    return
  }
}
