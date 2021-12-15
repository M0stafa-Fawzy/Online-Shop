require('../src/db/mongoose')
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : true 
    } , price : {
        type : String , 
        require : true
    } , details : {
        type : String
    } , vendor : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'users'
    } , photo : {
        type : Buffer
    }
} , {
    timestamps : true
})

const Products = mongoose.model('products' , productSchema)

module.exports = Products


// const t = new Products({
//     name : "samna" , 
//     price : 25
// })

// t.save()