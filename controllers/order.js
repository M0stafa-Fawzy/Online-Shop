const Order = require("../models/order")
const Product = require("../models/product")

const makeAnOrder = async (req, res) => {
    try {
        const { id } = req.params
        const { _id } = req.user  
        const product = await Product.findById({id})
        if(!product) return res.status(400).send({ message: 'Product Not Found' })

        const order = Order.create({
            user: _id , 
            product: id
        })
        if(!order) return res.status(400).send({ message: 'make an order failed' })

        return res.status(201).json({ order })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const getOrders = async (req, res) => {
    try {
        const { _id } = req.user  
        const orders = await Order.find({user: _id})
        if(!orders || orders.length === 0) return res.status(200).json({ message: "you haven't made any orders yet" })
        return res.status(200).json({ orders })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const addToCart = async (req, res) => {
    try {
        const { id } = req.params
        const { user } = req
        let { carts } = user

        const product = await Product.findOne({_id: id})
        if(!product) return res.status(400).json({ message: 'Product Not Found!' })

        carts = carts.concat({cart: id})
        await user.save()

        return res.status(200).json({ carts })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const deleteCart = async (req, res) => {
    try {
        const { id } = rea.params
        const { user } = req
        let { carts } = user

        carts = carts.filter((cart) => cart._id != id)
        await user.save()

        return res.status(200).json({ carts })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

module.exports = {
    makeAnOrder,
    getOrders,
    addToCart,
    deleteCart
}