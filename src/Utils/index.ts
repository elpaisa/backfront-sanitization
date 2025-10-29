/* eslint-disable no-new */
import { decode } from 'html-entities'
import validator from 'validator'
import { SQL_REGEX, VALIDATE_XSS_KEY, XSS_REGEX } from '../Constants'
import { ConfigType, ValidationType } from '../Types/ConfigType'

export const validateFunctions: any = {
  validateXSS: (input: string, key: string, cleanOnly: boolean) => {
    if (typeof input !== 'string') {
      return input
    }
    const decoded = decode(input)
    const tests = XSS_REGEX.filter((r) => r.test(decoded))

    if (tests.length) {
      if (!cleanOnly) {
        throw new Error(`Invalid input for ${key}: ${decoded}`)
      }

      let sanitized: any = null

      XSS_REGEX.forEach((r) => {
        sanitized = !sanitized
          ? decoded.replace(r, '')
          : sanitized.replace(r, '')
      })

      return sanitized.trim()
    }

    return input
  },
  validateSqlInjection: (input: string, key: string, cleanOnly: boolean) => {
    const sanitized = validateFunctions.validateXSS(input, key, cleanOnly)
    if (typeof sanitized !== 'string') {
      return sanitized
    }

    if (SQL_REGEX.test(sanitized)) {
      throw new Error(`Invalid input for ${key}`)
    }

    return sanitized
  },
  validateEmail: (input: string, key: string, cleanOnly: boolean) => {
    const sanitized = validateFunctions.validateXSS(input, key, cleanOnly)

    if (typeof sanitized !== 'string' || !validator.isEmail(sanitized)) {
      if (!cleanOnly) {
        throw new Error(`Invalid input email for ${key}`)
      }

      return sanitized.replace(XSS_REGEX, '')
    }

    return sanitized
  },
  validateURL: (input: string, key: string, cleanOnly: boolean) => {
    try {
      const sanitized = validateFunctions.validateXSS(input, key, cleanOnly)

      if (
        typeof sanitized !== 'string' ||
        !sanitized.length ||
        !validator.isURL(sanitized)
      ) {
        throw new Error(`Invalid url for ${key}: ${input}`)
      }
      new URL(sanitized)

      return sanitized
    } catch (err) {
      throw new Error(`Invalid url for ${key}: ${input}`)
    }
  },
  validateNumber: (input: string, key: string, cleanOnly: boolean) => {
    const sanitized = validateFunctions.validateXSS(input, key, cleanOnly)

    if (!validator.isNumeric(input) || Number.isNaN(parseInt(sanitized, 10))) {
      throw new Error(`Invalid input for number: ${key}`)
    }

    return input
  }
}

export const suggestion = (fn: string) => {
  const msg = 'Config function is not valid'

  if (!fn || typeof fn !== 'string') {
    return msg
  }

  const keys = Object.keys(validateFunctions)
  const suggestions = keys.filter((k) => k.toLocaleLowerCase().includes(fn))

  return suggestions.length ? `Did you mean ${suggestions[0]}?` : msg
}

export const validateInput = (
  input: string,
  key: string,
  config: ConfigType
) => {
  const fn: ValidationType =
    config.form && config.form[key] ? config.form[key] : VALIDATE_XSS_KEY
  const cleanOnly: boolean = config.cleanOnly || false

  if (!validateFunctions[fn]) {
    throw new Error(
      `Invalid validation config for ${key}: ${fn}, ${suggestion(fn)}`
    )
  }

  return validateFunctions[fn](input, key, cleanOnly)
}

export const validateObject = (obj: any, config: ConfigType = {}) => {
  const sanitized: any = {}

  Object.keys(obj).forEach((key: string) => {
    if (typeof obj[key] === 'string') {
      sanitized[key] = validateInput(obj[key], key, config)
    } else if (typeof obj[key] === 'object') {
      sanitized[key] = validateObject(obj[key], config)
    } else if (Array.isArray(obj[key])) {
      sanitized[key] = obj[key].map((item: any) => validateObject(item, config))
    } else {
      sanitized[key] = obj[key]
    }
  })

  return sanitized
}
