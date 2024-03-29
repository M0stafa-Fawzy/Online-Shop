const Product = require("../models/product")
const cloudinary = require("cloudinary").v2;

const AddProduct = async (req, res) => {
    try {
        const { _id } = req.user
        const { name, price, detailes } = req.body
        const product = await new Product({
            name, 
            price, 
            detailes,
            vendor: _id
        }).save()

        if(!product) return res.status(400).json({ message: "failed to add a aproduct" })
        return res.status(201).json({ product })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const getProductsPerVendor = async (req, res) => {
    try {
        const { user } = req
        const { role } = user
        const { name, sortBy, limit, skip } = req.query

        const match = {}
        const sort = {}

        if (name) {
            match.name = name
        }

        if (sortBy) {
            const parts = sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        await user.populate({
            path: 'products',
            match,
            options: {
                limit: parseInt(limit),
                skip: parseInt(skip),
                sort
            }
        })

        return res.status(200).json({ products: user.products })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const getAllProducts = async (req, res) => {
    try {
        const { name, sortBy, limit, skip } = req.query
        
        if (name) {
            const products = await Product.find({ name })
            return res.status(200).json({ products })
        }

        const sort = {}
        if (sortBy) {
            const parts = sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 // 'asc'
        }

        const products = await Product.find({})
        //.select('name')
        .populate('vendor name -_id')
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .sort(sort)
        return res.status(200).json({ products })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if(!product) return res.status(200).json({ message: "product not found" })
        return res.status(200).json({ product })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const uploadMultiPleProductPhotos = async (req, res) => {
    try {
        const { id } = req.params
        const { _id } = req.user
        const { files } = req

        const product = await Product.findOne({_id: id, vendor: _id})
        if(!product){
            return res.status(200).json({ message: 'product not found' })
        }
        let { photos } = product

        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
        });

        for(i in files) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(files[i].path)
            if(!public_id || !secure_url){
                return res.status(200).json({ message: "failed to upload photos please try again later" })
            } 
            photos.push({ photo: { public_id, secure_url }})
            await product.save()
        }

        return res.status(200).json({ message: "photos uploded successfully" })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { _id } = req.user
        const { name, price, detailes } = req.body

        const product = await Product.findOneAndUpdate(
        {_id: id, vendor: _id}, { name, price, detailes }, { new: true, runValidators: true }
        )

        if(!product) return res.status(400).json({ message: 'failed to update a product' })
        return res.status(200).json({ product })       
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { _id } = req.user

        const product = await Product.findOneAndDelete({_id: id, vendor: _id})
        if(!product) return res.status(400).send({ message: 'failed to delete a product' })
        
        return res.status(200).json({ product })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

module.exports = {
    AddProduct,
    getProductsPerVendor,
    getAllProducts,
    getSingleProduct,
    uploadMultiPleProductPhotos,
    updateProduct,
    deleteProduct
}