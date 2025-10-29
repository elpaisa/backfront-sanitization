export type VALIDATE_XSS = 'validateXSS'
export type VALIDATE_INJECTION = 'validateSqlInjection'
export type VALIDATE_EMAIL = 'validateEmail'
export type VALIDATE_URL = 'validateURL'
export type VALIDATE_NUMBER = 'validateNumber'
export type ValidationType =
  | VALIDATE_XSS
  | VALIDATE_INJECTION
  | VALIDATE_EMAIL
  | VALIDATE_URL
  | VALIDATE_NUMBER

export interface ConfigType {
  cleanOnly?: boolean
  form?: {
    [key: string]:
      | VALIDATE_XSS
      | VALIDATE_INJECTION
      | VALIDATE_EMAIL
      | VALIDATE_URL
      | VALIDATE_NUMBER
  }
}
