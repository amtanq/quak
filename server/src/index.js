require('express-async-errors')
const express = require('express')
const cors = require('cors')
const router = require('./router')

const app = express()
app.use(cors())
app.use(express.json())
app.use(router)

app.use((_, req, res) => res.status(404).send())
app.use((_, req, res, next) => res.status(400).send())
app.listen(process.env.PORT)
