const Product = require("../models/product")
const AddProduct = async (req, res) => {
    try {
        const { role, _id } = req.user

        if (role === 'vendor') {
            const { name, price, detailes } = req.body
            const product = Product.create({
                name, 
                price, 
                detailes,
                vendor: _id
            })

            if(!product) return res.status(400).json({ message: "failed to add a aproduct" })
            return res.status(201).json({ product })
        } else {
            return res.status(401).send('Sorry! Only Vendor Can Add a Product')
        }
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const getProductsPerVendor = async (req, res) => {
    try {
        const { user } = req
        const { role } = user
        const { name, sortBy, limit, skip } = req.query

        if (role === 'vendor') {
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
        }else{
            return res.status(400).send()
        }
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

const uploadProductPhoto = async (req, res) => {
    try {
        const { id } = req.params
        const { _id } = req.user
        const { file } = req.file

        const product = await Product.findOne({_id: id, vendor: _id})
        if(!product){
            return res.status(200).json({ message: 'product not found' })
        }

        const pic = await sharp(file.buffer).resize({width : 250 , height : 250}).png().toBuffer()
        return res.status(200).json({ message: "photo uploded successfully" })
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
    uploadProductPhoto,
    updateProduct,
    deleteProduct
}