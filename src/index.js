'use strict'

import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import pino from 'pino-http'
import proxy from 'express-http-proxy'

import { ProxiesEmitter } from './emitters/proxies.emitter.js'
import { Routers } from './routers/index.js'
import { auth } from './middlewares/auth.middleware.js'
import { db } from './db.js'
import { logger } from './logger.js'

async function main () {
  dotenv.config()
  const { PORT, TOKEN } = process.env

  await db.read()
  db.data ||= { proxies: [] }
  await db.write()

  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(helmet())
  app.use(pino())

  app.get('/health', (_request, response) => response.json({ I: 'am alive' }))
  app.use('/proxies', auth({ token: TOKEN }), Routers.proxies)

  for (const { namespace, target } of db.data.proxies) {
    app.use(namespace, proxy(target))
  }

  ProxiesEmitter.emitter.on(
    ProxiesEmitter.Events.NEW_PROXY,
    ({ namespace, target }) => {
      app.use(namespace, proxy(target))
    }
  )

  app.listen(PORT, () => logger.info(`Listening on ${PORT}`))
}

main()
