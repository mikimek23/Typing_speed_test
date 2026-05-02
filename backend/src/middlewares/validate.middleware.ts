import { ZodError, ZodTypeAny } from 'zod'
import { Request, Response, NextFunction } from 'express'
export const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)

      next()
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: err.issues[0].message,
        })
      }
    }
  }
