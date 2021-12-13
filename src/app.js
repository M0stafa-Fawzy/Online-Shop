const express = require('express')
const app = express()
app.use(express.json())

const userRouter = require('../routes/userRoute')
app.use(userRouter)

module.exports = app