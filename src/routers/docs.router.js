import { createRequire } from 'node:module'
import { join } from 'node:path'

import swaggerUI from 'swagger-ui-express'
import { Router } from 'express'

const require = createRequire(import.meta.url)

const packageJson = require(join('..', '..', 'package.json'))
const swaggerJson = require(join('..', 'swagger.json'))

const router = Router()

const { ENABLE_SWAGGER = 'true' } = process.env

if (ENABLE_SWAGGER === 'true') {
  router
    .use(
      swaggerUI.serve,
      swaggerUI.setup({
        ...swaggerJson,
        info: {
          ...swaggerJson.info,
          version: packageJson.version
        },
        servers: [
          ...swaggerJson.servers,
          {
            url: 'http://localhost:3000'
          }
        ]
      })
    )
}

export const docs = router
