import http from 'node:http'

import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import pino from 'pino-http'
import proxy from 'express-http-proxy'

import { Routers } from './routers/index.js'
import { auth } from './middlewares/auth.middleware.js'
import { db } from './db.js'

const { TOKEN } = process.env

const app = express()

app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(pino({
  ...process.env.NODE_ENV !== 'production'
    ? {
        transport: {
          target: 'pino-pretty'
        }
      }
    : {}
}))

app.get('/', (_request, response) => response.json({ I: 'am alive' }))
app.use('/docs', Routers.docs)
app.use('/metrics', Routers.metrics)
app.use('/proxies', auth({ token: TOKEN }), Routers.proxies)
app.use('/:namespace', proxy(request => {
  const { target } = db
    .data
    .proxies
    .find(({ namespace }) => namespace === request.params.namespace) || {}

  return target
}))

/**
 * @type {import('http').Server}
 */
export const server = http.createServer(app)
