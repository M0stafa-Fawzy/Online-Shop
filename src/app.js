const express = require('express')
const app = express()
app.use(express.json())

const userRouter = require('../routes/userRoute')
const productRouter = require('../routes/productRoute')
const orderRouter = require('../routes/orderRoute')
app.use(userRouter)
app.use(productRouter)
app.use(orderRouter)

module.exports = app