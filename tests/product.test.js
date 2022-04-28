const app = require('../src/app')
const request = require('supertest')
const Users = require('../models/user')
const Products = require('../models/product')

const { user1Id, user1, user2Id, user2, user3Id, user3, product1, product2, product3, product4, setUpDB } = require('./assets/db')

beforeEach(setUpDB)

test('should create a product', async () => {
    const response = await request(app)
    .post('/products')
    .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
    .send({
        name: 'test suite product',
        price: 120,
        vendor: user1Id
    })
    .expect(201)

    const product = await Products.findById(response.body._id)
    expect(product).not.toBeNull( )
})

test('should fetch products for vendor', async () => {
    const response = await request(app)
    .get('/profile/products')
    .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)

    expect(response.body.length).toEqual(2)
})

test('should fetch all products', async () => {
    const response = await request(app)
    .get('/products')
    .send()
    .expect(200)

    expect(response.body.length).toEqual(4)
})

test('should update product', async () => {
    const response = await request(app)
    .patch(`/products/${product1._id}`)
    .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
    .send({
        name: 'this is test new name'
    })
    .expect(200)

    expect(response.body.name).toEqual('this is test new name')
})

test('should delete product', async () => {
    const response = await request(app)
    .delete(`/products/${product1._id}`)
    .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
})