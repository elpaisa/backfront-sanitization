import { describe, expect } from '@jest/globals'

import {
  SanitizerMiddleware,
  validateFunctions,
  validation,
  Sanitization
} from '../index'

const form = {
  invalidForm: {
    name: '<script>alert("XXXSSS")</script>John Doe',
    email: 'invalidemail<script>alert("XXXSSS")</script>@gmail.com',
    url: 'https://invalidurl.com?s=<script>alert("XXXSSS")</script>'
  },
  validForm: {
    name: 'John Doe',
    email: 'johndoe@example.com',
    url: 'https://www.example.com'
  },
  encodedForm: {
    name: 'John Doe &#x3C;script&#x3EA;lert&#x27;newline?&#x27;&#x3C;/script&#x3E;'
  }
}
describe('Sanitizer Component', () => {
  it('Should validate email', () => {
    expect(validation.isEmail(form.validForm.email)).toBe(true)
    expect(validation.isEmail(form.invalidForm.email)).toBe(false)
    expect(
      validation.isEmail(
        validateFunctions.validateXSS(form.invalidForm.email, 'email', true)
      )
    ).toBe(true)
  })
  it('Should validate url', () => {
    expect(validation.isURL(form.validForm.url)).toBe(true)
    expect(validation.isEmail(form.invalidForm.url)).toBe(false)
  })
  it('Should throw error', () => {
    try {
      Sanitization(form.invalidForm, {
        form: {
          name: 'validateXSS',
          email: 'validateEmail',
          url: 'validateURL'
        }
      })
    } catch (err: any) {
      expect(err.message).toBe(
        'Invalid input for name: <script>alert("XXXSSS")</script>John Doe'
      )
    }
  })
  it('Should throw error for detected encoded payload XSS', () => {
    try {
      Sanitization(form.encodedForm)
    } catch (err: any) {
      expect(err.message).toBe(
        "Invalid input for name: John Doe <scriptϪlert'newline?'</script>"
      )
    }
  })
  it('Should clean XSS from encoded string', () => {
    const sanitized = Sanitization(form.encodedForm, {
      cleanOnly: true
    })

    expect(sanitized).toEqual({
      name: 'John Doe'
    })
  })
  it('Should clean payload SanitizerMiddleware', () => {
    const requestData = {
      query: {
        /* Your query data */
      },
      params: {
        /* Your params data */
      },
      body: form.invalidForm
    }
    const mockReq = requestData // Mock request object
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } // Mock response object

    SanitizerMiddleware(mockReq, mockRes, () => {})
    expect(mockRes.status).toHaveBeenCalledWith(400) // Adjust this as needed
  })
})
