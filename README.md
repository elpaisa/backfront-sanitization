# sanitizer

> Sanitizer component

This is a Sanitizer component for a payload of json that can be configured to perform certain validations on every attribute contents of a form payload.

- XSS
- URL validation

This component can be used as a middleware for Express, to sanitize body payload input and check XSS strings in the payload, if contaminated payload is detected it throws an exception, it can be configured to just clean the payload and not error using:

```
  process.env.SANITIZER_CLEAN_ONLY = true
```

- USAGE:

- Node Express:

  ```
    const sanitizer = require('@elpaisa/backfront-sanitization');
    app.use(sanitizer)
  ```

- React:

  ```
    import { validateInput } from '@elpaisa/backfront-sanitization'

    handleSubmit(payload) => {
      const sanitized = validateInput(payload, { cleanOnly: true|false, form: {
        email:
      }})
    }
  ```

Optional configuration:

```

```

Install the sanitizer package.

```bash
npm install --save @elpaisa/backfront-sanitization
```
