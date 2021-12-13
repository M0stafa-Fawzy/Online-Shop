const app = require('../src/app')
const request = require('supertest')
const Users = require('../models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const user1Id = new mongoose.Types.ObjectId() 
console.log(user1Id)

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

beforeEach( async () => {
    await Users.deleteMany()
    await new Users(user1).save()
})

test('/should sign up' , async () => {
    const response = await request(app)
    .post('/users')
    .send({
        name : "Arnold" , 
        email : "arnold@example.com" ,
        phoneNumber : "01121299368" , 
        password: "mypass123!" ,
        role : "user"
    })
    .expect(201)

    const user = await Users.findById(response.body.user._id)
    expect(user).not.toBeNull()
})

test('should login' , async () => {
    const response = await request(app)
    .post('/login')
    .send({
        email : user1.email , 
        password : user1.password
    })
    .expect(200)

    const user = await Users.findById(user1._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login' , async () => {
    await request(app)
    .post('/login')
    .send({
        email : user1.email , 
        password :' user1.password'
    })
    .expect(400)
})

test('should log out' , async () => {
    const response = await request(app)
    .post('/logout')
    .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)

    // const user = await Users.findById(user1Id)
    // const check = user.tokens.filter( (token) => {
    //     return token.token !== user1.tokens[0].token
    // })
    // expect(check.length).toBe(0)
})

test('should get profile' , async () => {
    await request(app)
    .get('/users/profile')
    .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should delete profile' , async () => {
    await request(app)
    .delete('/users/profile')
    .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
})

















































































// const app = require('../src/app')
// const Users = require('../models/user')
// const jwt = require('jsonwebtoken')
// const mongoose = require('mongoose')
// const request = require('supertest')

// const userId = new mongoose.Types.ObjectId()
// console.log(userId)

// const user = {
//     _id : userId ,
//     phoneNumber : "01277563226",
//     name : "Test User",
//     email : "test123@gmail.com",
//     password : "MyTestPass123!",
//     role : "vendor" , 
//     tokens: [{
//         token: jwt.sign({ _id: userId }, process.env.JWT_KEY)
//     }]
// }

// beforeEach( async () => {
//     await Users.deleteMany()
//     await new Users(user).save()
// })

// test('test signup functionality' , async () => {
//     const response = await request(app).post('/users').send({
//         phoneNumber : "01221299368",
//         name : "Mostafa",
//         email : "mostafaa@gmail.com",
//         password : "Myapasssyshhs",
//         role : "vendor"
//     }).expect(201)

//     const user = await Users.findById(response.body.user._id)
//     expect(user).not.toBeNull()
// })


// test('should login successfully' , async () => {
//     const response = await request(app).post('/login')
//     .send({
//         email : user.email , 
//         password : user.password
//     })
//     .expect(200)

//     const usert = await Users.findById(userId)
//     expect(response.body.token).toBe(usert.tokens[1].token)
// })


// test('should not login' , async () => {
//     await request(app).post('/login').send({
//         email : user.email , 
//         password : 'paaaaaasaa'
//     }).expect(400)
// })





// test('test failed login functionality' , async () => {
//     await request(app).post('/login').send({
//         email : user.email , 
//         password : 'user.password'
//     }).expect(401)
// })

// test('should delete profile' , async () => {
//     await request(app).delete('/profile')
//     .set('Authorization' , `Bearer ${user.tokens[0].token}`)
//     .send()
//     .expect(200)

//     // const userte = await Users.findById(userId)
//     // expect(userte).toBeNull()
// })

// test('should not delete profile' , async () => {
//     await request(app).delete('/profile')
//     .send()
//     .expect(401)
// })


















