const Users = require('../../models/user')
const Products = require('../../models/product')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const user1Id = new mongoose.Types.ObjectId() 
const user1 = ({
    _id : user1Id , 
    name : "Klopp" , 
    email : "Klopp@example.com" ,
    phoneNumber : "01123226955" , 
    password: "thisismyPass758@!" ,
    role : "vendor" , 
    tokens : [{
        token : jwt.sign({_id : user1Id } , process.env.JWT_KEY)
    }]
})

const user2Id = new mongoose.Types.ObjectId() 
const user2 = ({
    _id : user2Id , 
    name : "Robertson" , 
    email : "Robertson@example.com" ,
    phoneNumber : "01120203621" , 
    password: "thisisRobertsonPass758@!" ,
    role : "user" , 
    tokens : [{
        token : jwt.sign({_id : user2Id } , process.env.JWT_KEY)
    }]
})

const user3Id = new mongoose.Types.ObjectId() 
const user3 = ({
    _id : user3Id , 
    name : "Vigil Van Dijk" , 
    email : "virgil@example.com" ,
    phoneNumber : "01520302568" , 
    password: "thisis   v   irgilPass758@!" ,
    role : "vendor" , 
    tokens : [{
        token : jwt.sign({_id : user3Id } , process.env.JWT_KEY)
    }]
})

const product1 = {
    _id: new mongoose.Types.ObjectId() ,
    name: "test product 1",
    price: "100",
    vendor: user1._id
}

const product2 = {
    _id: new mongoose.Types.ObjectId() ,
    name: "test product 2",
    price: "175",
    vendor: user1Id
}

const product3 = {
    _id: new mongoose.Types.ObjectId() ,
    name: "test product 3",
    price: "175",
    vendor: user3Id
}

const product4 = {
    _id: new mongoose.Types.ObjectId() ,
    name: "test product 4",
    price: "175",
    vendor: user3Id
}

const setUpDB = async () => {
    await Users.deleteMany()
    await Products.deleteMany()

    await new Users(user1).save()
    await new Users(user2).save()
    await new Users(user3).save()

    await new Products(product1).save()
    await new Products(product2).save()
    await new Products(product3).save()
    await new Products(product4).save()
}

module.exports = {
    user1Id,
    user1,
    user2Id,
    user2,
    user3Id,
    user3,
    product1,
    product2,
    product3,
    product4,
    setUpDB
}