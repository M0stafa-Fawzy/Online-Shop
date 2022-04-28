const Users = require('../models/user')
const Products = require('../models/product')
const Orders = require('../models/order')
const express = require('express')
const auth = require('../src/middlewares/auth')
const orderRouter = new express.Router()

function makeAnOrder () {
    orderRouter.post('/order/:id' , auth , async (req , res) => {
        try{
            const product = await Products.findById(req.params.id)
            if(!product){
                return res.status(404).send('Product Not Found')
            }
            const order = new Orders({
                user : req.user._id , 
                product : req.params.id
            })
            await order.save()
            res.status(201).send(order)
        }catch(e){
            res.status(400).send(e)
        }
    })
}

makeAnOrder ()


function getOrders () {
    orderRouter.get('/orders' , auth, async (req , res) => {
        try{
            const orders = await Orders.find({user: req.user._id})
            if(orders.length === 0){
                return res.status(404).send()
            }
            res.status(200).send(orders)
        }catch(e){
            res.status(400).send(e)
        }
    })
}

getOrders ()


function addToCart(){
    orderRouter.post('/carts/:id' , auth , async (req , res)=> {
        try{
            const product = await Products.findOne({_id : req.params.id})
            if(!product){
                throw new Error ('Product Not Found!')
            }
            req.user.carts = req.user.carts.concat({cart : req.params.id})
            await req.user.save()
            res.status(200).send(req.user)
        }catch(e){
            res.status(400).send(e)
        }
    })
}

addToCart()

function deleteCart(){
    orderRouter.delete('/carts/:id' , auth , async (req , res) => {
        try{
            req.user.carts = req.user.carts.filter( (cart) => {
                return cart._id != req.params.id
            })
            await req.user.save()
            res.status(200).send(req.user.carts)
        }catch(e){
            res.status(400).send()
        }
    })  
}

deleteCart()


module.exports = orderRouter