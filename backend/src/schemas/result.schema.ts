import { z } from 'zod'

export const resultSchema = z
  .object({
    textId: z.string().uuid().optional(),

    mode: z.enum(['timed', 'passage']),

    durationSeconds: z.number().int().positive(),

    correctCharacters: z.number().int().nonnegative(),

    totalKeyPresses: z.number().int().positive(),
  })
  .refine((data) => data.correctCharacters <= data.totalKeyPresses, {
    message: 'correctCharacters cannot exceed totalKeyPresses',
    path: ['correctCharacters'],
  })
export const resultQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  mode: z.enum(['timed', 'passage']).optional(),
})

export type resultQueryInput = z.infer<typeof resultQuerySchema>
export type ResultInput = z.infer<typeof resultSchema>
