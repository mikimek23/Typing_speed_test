import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email('Invalid email').trim().toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain uppercase')
    .regex(/[a-z]/, 'Password must contain lowercase')
    .regex(/\d/, 'Password must contain number')
    .regex(/[@$!%*?&]/, 'Password must contain special character'),
})
export const loginUserSchema = z.object({
  email: z.string().email('Invalid email').trim().toLowerCase(),
  password: z.string().min(8),
})
export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginInput = z.infer<typeof loginUserSchema>
