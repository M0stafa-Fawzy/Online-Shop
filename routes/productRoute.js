const Products = require('../models/product')
const express = require('express')
const auth = require('../src/middlewares/auth')
const multer = require('multer')
const sharp = require('sharp')
const productRouter = new express.Router()

const upload = multer({
    limits : {
        fileSize : 5000000
    } , fileFilter (req , file , cb) {
        if(!file.originalname.match(/\.(jpg|jpes|png)$/)){
            return cb(new Error('picture format not matched , please upload jpg,jpes or png image'))
        }
        cb(undefined , true)
    }
})


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
    productRouter.get('/products/:id', auth , async (req, res) => {
        try{
            const product = await Products.findOne({_id : req.params.id , vendor : req.user._id})
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

function getAllProducts(){
    productRouter.get('/products' , async (req, res) => {
        try{
            const products = await Products.find()
            res.send(products)
        }catch(e){
            res.status(400).send(e)
        }
    })
}

getAllProducts()

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



function AddProduct(){
    productRouter.post('/products' , auth , async (req , res) => {
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
    productRouter.delete('/products/:id' , auth , async (req , res) => {
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





module.exports = productRouter