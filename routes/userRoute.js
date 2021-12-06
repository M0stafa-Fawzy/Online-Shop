const express = require('express')
const Users = require('../models/user')
const Products = require('../models/product')
const Orders = require('../models/order')
const auth = require('../src/middlewares/auth')
const userRouter = new express.Router()

function Singnup (){
    userRouter.post('/users' , async (req, res) => {
        try{
            const user = new Users(req.body)
            const token = await user.generateAuthToken()
            await user.save()
            res.status(201).send({user , token})
        }catch(e){
            res.status(400).send(e)
        }
    })
}

Singnup()

function login(){
    userRouter.post('/login' , auth , async(req,res) => {
        try{
            const user = await Users.findUser(req.body.email , req.body.password)
            const token = await user.generateAuthToken()
            res.status(200).send({user , token})
        }catch(e){
            res.status(400).send(e)
        }
    })
}

login()

// userRouter.get('/t' , async (req,res) => {
//     const t = await Users.countDocuments({role : "USER".toLocaleLowerCase()})
//     res.json(t)
// })


function logout(){
    userRouter.post('/logout' , auth , async (req , res) => {
        try{
            // remove the requested token
            // token.token --> the counter.the token itself not _id
            req.user.tokens = req.user.tokens.filter( (token) => {
                return token.token !== req.token
            })
            await req.user.save()
            res.send()
        }catch(e){
            res.status(400).send(e)
        }
    })
}

logout()

function logoutAll () {
    userRouter.post('/logoutAll' , auth , async(req , res) => {
        try{
            req.user.tokens = []
            await req.user.save()
            res.status(200).send()
        }catch(e){
            res.status(400).send(e)
        }
    })
}

logoutAll ()


function makeAnOrder () {
    userRouter.post('/order/:id' , auth , async (req , res) => {
        try{
            const product = await Products.findOne({_id : req.params.id})
            if(!product){
                res.status(404).send('Product Not Found')
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

function addToCart(){
    userRouter.post('/carts/:id' , auth , async (req , res)=> {
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
    userRouter.delete('/carts/:id' , auth , async (req , res) => {
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

function AddProduct(){
    userRouter.post('/products' , auth , async (req , res) => {
        try{
            if(req.user.role === 'vendor'){
                const product = new Products({
                    ...req.body , 
                    vendor : req.user._id
                })
                await product.save()
                res.status(201).send(product)
            }else{
                res.status(401).send('Sorry! Only Vendor Can Add a Product')
            }
        }catch(e){
            res.status(400).send(e)
        }
    })

}

AddProduct()



function deleteProduct(){
    userRouter.delete('/products/:id' , auth , async (req , res) => {
        try{
            const product = await Products.findOne({_id : req.params.id , vendor : req.user._id})
            if(!product){
                res.status(404).send('Product Not Found!')
            }else{
                await product.remove()
                res.status(200).send(product)
            }
        }catch(e){
            res.status(400).send(e)
        }
    })

}

deleteProduct()

function confirmOrder(){

}


function cancelOrder(){

}


// function payment(){
//     // isCreditCard(str)
//     const Publishable_key = pk_test_51K2NpfA08jxyobg1I3QFwJJsmEsxWqAYxcwExBdOoJ5DLnxq1jZfy8xMhpqsd4TGHqosY6I8KwNS2cptJEpNyqEV00BJJRoaHe
//     const Secret_key = sk_test_51K2NpfA08jxyobg1job46kv5WXwO29CMY6IMTmj2UVlbmpERzTeUcfMoeXUUYdaVU713axUyquPAzeC27F0ZSEOZ00KL8ltUCb
// }


module.exports = userRouter