import { z } from 'zod'

export const AddTextSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),

  content: z
    .string()
    .trim()
    .min(20, 'Content must be at least 100 characters')
    .max(50000, 'Content is too long'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
})
export const UpdateTextSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .optional(),

  content: z
    .string()
    .trim()
    .min(20, 'Content must be at least 20 characters')
    .max(50000, 'Content is too long')
    .optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
})

export type AddTextInput = z.infer<typeof AddTextSchema>
export type UpdateTextInput = z.infer<typeof UpdateTextSchema>
