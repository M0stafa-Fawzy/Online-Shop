const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }, product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }
})


const Orders = mongoose.model('orders', orderSchema)

module.exports = Orders
