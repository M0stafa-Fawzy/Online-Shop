const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : true 
    } , price : {
        type : Number , 
        require : true
    } , details : {
        type : String
    } , vendor : {
        type : mongoose.Schema.Types.ObjectId , 
        required : true ,
        ref : 'users'
    } , photo : {
        type : Buffer
    }
} , {
    timestamps : true
})

productSchema.virtual('orders' , {
    ref : 'orders' ,
    localField : '_id' ,
    foreignField : 'product'
})

const Products = mongoose.model('products' , productSchema)

module.exports = Products