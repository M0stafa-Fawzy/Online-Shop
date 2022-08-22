const app = require('../src/app')
const request = require('supertest')
const Users = require('../models/user')
const {user1Id, user1,  setUpDB} = require('./assets/db')

beforeEach(setUpDB)

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
    .post('/users/login')
    .send({
        email : user1.email , 
        password : user1.password
    })
    .expect(200)

    const user = await Users.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should get profile' , async () => {
    const response = await request(app)
    .get('/users')
    .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await Users.findById(response.body._id)
    expect(user).not.toBeNull()
})

test('should delete profile' , async () => {
    await request(app)
    .delete('/users')
    .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await Users.findById(user1._id)
    expect(user).toBeNull()
})


test('should update profile', async () => {
    const response = await request(app)
    .patch('/users')
    .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
    .send({
        name: 'New Name',
        email: 'newemail@example.com'

    })
    .expect(200)

    const user = await Users.findById(response.body._id)
    expect(user.name).toEqual('New Name')
})

test('should add profile picture', async () => {
    const response = await request(app)
    .post('/users/upload')
    .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
    .attach('profilepicture', 'tests/assets/gerrard.jpg')
    .expect(200)

    // toEqual uses == not ===
    const user = await Users.findById(user1Id)
    expect(user.profile_picture).toEqual(expect.any(Buffer))
})

