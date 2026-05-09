import jwt from 'jsonwebtoken'
import { getEnv } from '../config/env.js'

const env = getEnv()
type JwtPayload = {
  id: string
  email: string
  type: 'refresh' | 'access'
}
export const generateAccessToken = (payload: JwtPayload) => {
  try {
    return jwt.sign(payload, env.accessTokenSecret, {
      expiresIn: '15m',
    })
  } catch (err) {
    console.log(err)
  }
}
export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.refreshTokenSecret, {
    expiresIn: '7d',
  })
}
