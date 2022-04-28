const Products = require('../models/product')
const express = require('express')
const auth = require('../src/middlewares/auth')
const upload = require('../src/middlewares/upload')
const sharp = require('sharp')
const productRouter = new express.Router()


function AddProduct(){
    productRouter.post('/products', auth, async (req, res) => {
        try {
            if (req.user.role === 'vendor') {
                const product = new Products({
                    ...req.body,
                    vendor: req.user._id
                })
                await product.save()
                res.status(201).send(product)
            } else {
                res.status(401).send('Sorry! Only Vendor Can Add a Product')
            }
        } catch (e) {
            res.status(400).send(e)
        }
    })
}

AddProduct()

function getProductsPerVendor() {
    productRouter.get('/profile/products', auth, async (req, res) => {
        if (req.user.role === 'vendor') {
            const match = {}
            const sort = {}
            if (req.query.name) {
                match.name = req.query.name
            }
            if (req.query.sortBy) {
                const parts = req.query.sortBy.split(':')
                sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
            }
            try {
                await req.user.populate({
                    path: 'products',
                    match,
                    options: {
                        limit: parseInt(req.query.limit),
                        skip: parseInt(req.query.skip),
                        sort
                    }
                })
                res.status(200).json(req.user.products)
            } catch (e) {
                res.status(400).send(e)
            }
        }else{
            res.status(400).send()
        }
    })
}

getProductsPerVendor()


function getAllProducts() {
    productRouter.get('/products', async (req, res) => {
        try {
            if (req.query.name) {
                const products = await Products.find({name: req.query.name})
                return res.status(200).send(products)
            }
            const sort = {}
            if (req.query.sortBy) {
                const parts = req.query.sortBy.split(':')
                sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 // 'asc'
            }

            const products = await Products.find({})
            //.select('name')
            .populate('vendor')
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .sort(sort)
            res.status(200).json(products)
        } catch (e) {
            res.status(400).send(e)
        }
    })
}
getAllProducts()

function uploadProductPhoto(){
    productRouter.post('/products/picture/:id' , auth , upload.single('productPhoto') , async (req , res) => {
        const product = await Products.findOne({_id : req.params.id , vendor : req.user._id })
        if(!product){
            return res.status(404).send('product not found')
        }
        const pic = await sharp(req.file.buffer).resize({width : 250 , height : 250}).png().toBuffer()
        product.photo = pic
      //  req.actor.doesHavePicture = true
        await product.save()
        res.status(200).send(product)
    } , (error , req , res , next) => {
        res.status(400).send({error : error.message})
    })
} 

uploadProductPhoto()


function getProductPhoto(){
    productRouter.get('/products/:id' , async (req, res) => {
        try{
            const product = await Products.findById(req.params.id)
            if(!product){
                return res.status(404).send('product not found')
            }
            res.status(200).send(product.photo)
        }catch(e){
            res.status(400).send(e)
        }
    })
}

getProductPhoto()


function deleteProductPhoto(){
    productRouter.delete('/products/:id', auth , async (req, res) => {
        try{
            const product = await Products.findOne({_id : req.params.id , vendor : req.user._id})
            if(!product){
                return res.status(404).send('product not found')
            }
            product.photo = undefined
            await product.save()
            res.status(200).send(product)
        }catch(e){
            res.status(400).send(e)
        }
    })
}

deleteProductPhoto()

function updateProduct(){
    productRouter.patch('/products/:id' , auth , async (req, res) => {
        const product = await Products.findOne({_id : req.params.id , vendor : req.user._id})
        if(!product){
            return res.status(404).send('product not found')
        }
        const keys = Object.keys(req.body)
        const allowsUpdates = ['name' , 'price' , 'datails']
        const valid = keys.every( (update) => allowsUpdates.includes(update))
        if(!valid){
            return res.status(500).send({error : 'invalid updates'})
        }   
        try{
            keys.forEach( (update) => {
                product[update] = req.body[update]
            })
            await product.save()
            res.status(200).send(product)
        }catch(e){
            res.status(400).send(e)
        }    
    })
}

updateProduct()

function deleteProduct(){
    productRouter.delete('/products/:id' , auth , async (req , res) => {
        try{
            const product = await Products.findOneAndDelete({_id : req.params.id , vendor : req.user._id})
            if(!product){
                return res.status(404).send('Product Not Found!')
            }else{
                res.status(200).send()
            }
        }catch(e){
            res.status(400).send(e)
        }
    })
}

deleteProduct()


function confirmOrder(){

}





module.exports = productRouter