import express, { Application } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { config } from 'dotenv'

import mongooseInstance from './data.db.source/mongoose'
import { router } from './route'
import { logger } from './service/logger'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { swaggerDocument } from './configuration/swagger'

config()
const app: Application = express()
const spec = swaggerJSDoc(swaggerDocument)

app.use(cors())
app.use(express.json({}))
app.use(bodyParser.json({ type: 'application/*+json' }))

app.use('/api/v1', router)
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }))

mongooseInstance
  .then(() => {
    app.listen(process.env.PORT || 9090, () => {
      logger.info(`!!! Server is running on port ${process.env.PORT || 9090} !!!`)
    })
  })
  .catch((err) => {
    logger.error(err)
  })
