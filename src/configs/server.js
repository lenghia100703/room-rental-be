import 'express-async-errors'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import pino from 'express-pino-logger'
import helmet from 'helmet'
import logger from '#configs/logger'
import routes from '#routes/index'

const app = express()

app.use(bodyParser.json())
app.use(helmet())
app.use(cors())
// @ts-ignore pino version mismatch
app.use(pino({ logger }))

// routes
app.use('/api', routes)

export default app