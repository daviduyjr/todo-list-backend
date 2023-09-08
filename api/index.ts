import express from 'express'
import getHealth from './endpoints/get-health'

const app = express()

app.use(express.json())

app.get('/', getHealth)

export default app
