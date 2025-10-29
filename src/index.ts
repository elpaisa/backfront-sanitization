import validator from 'validator'
import { validateObject } from './Utils'

export * from './Constants'
export * from './Types/ConfigType'
export * from './Utils'

export const validation = validator

export function Sanitization(payload: any, config = {}) {
  return validateObject(payload, config)
}

export function SanitizerMiddleware(req: any, res: any, next: Function) {
  const { query, params, body } = req
  const cleanOnly = process.env && process.env.SANITIZER_CLEAN_ONLY === 'true'

  try {
    if (query) {
      req.query = Sanitization(query, { cleanOnly })
    }

    if (params) {
      req.params = Sanitization(params, { cleanOnly })
    }
    if (body) {
      req.body = Sanitization(body, { cleanOnly })
    }
  } catch (err: any) {
    return res.status(400).json({
      message: err.message
    })
  }

  return next()
}
