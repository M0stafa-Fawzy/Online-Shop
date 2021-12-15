const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Users = require('../models/user')
const Products = require('../models/product')
const Orders = require('../models/order')
const auth = require('../src/middlewares/auth')
const userRouter = new express.Router()

function Singnup (){
    userRouter.post('/users' , async (req, res) => {
        try{
            const user = new Users(req.body)
            const token = await user.generateAuthToken()
            await user.save()
            res.status(201).send({user , token})
        }catch(e){
            res.status(400).send(e)
        }
    })
}

Singnup()

function login(){
    userRouter.post('/login' , async(req,res) => {
        try{
            const user = await Users.findUser(req.body.email , req.body.password)
            const token = await user.generateAuthToken()
            res.status(200).send({user , token})
        }catch(e){
            res.status(400).send(e)
        }
    })
}

login()

// userRouter.get('/t' , async (req,res) => {
//     //Users called filter and findOne called query
//     const query = await Users.find();
//     res.send(query)
// })


function logout(){
    userRouter.post('/logout' , auth , async (req , res) => {
        try{
            // remove the requested token
            // token.token --> the counter.the token itself not _id
            req.user.tokens = req.user.tokens.filter( (token) => {
                return token.token !== req.token
            })
            await req.user.save()
            res.send()
        }catch(e){
            res.status(400).send(e)
        }
    })
}

logout()

function logoutAll () {
    userRouter.post('/logoutAll' , auth , async(req , res) => {
        try{
            req.user.tokens = []
            await req.user.save()
            res.status(200).send()
        }catch(e){
            res.status(400).send(e)
        }
    })
}

logoutAll ()

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


function uploadProfilePic(){
    userRouter.post('/profile/profilepicture' , auth , upload.single('profilepicture') , async (req , res) => {
        const pic = await sharp(req.file.buffer).resize({width : 250 , height : 250}).png().toBuffer()
        req.user.profile_picture = pic
      //  req.actor.doesHavePicture = true
        await req.user.save()
        res.status(200).send()
    } , (error , req , res , next) => {
        res.status(400).send({error : error.message})
    })
} 

uploadProfilePic()


function getProfilePic(){
    userRouter.get('/profile/profilepicture/:id' , async (req, res) => {
        try{
            const user = await Users.findById(req.params.id)
            if(!user && !user.profile_picture){
                return res.status(404).send()
            }
            res.status(200).send(user.profile_picture)
        }catch(e){
        res.status(400).send(e)
        }
    })
}

getProfilePic()


function getProfile(){
    userRouter.get('/users/profile' , auth , async (req , res) => {
        try{
            res.status(200).send(req.user)
        }catch(e){
            res.status(500).send(e)
        }
    })
}

getProfile()

function deleteProfile(){
    userRouter.delete('/users/profile' , auth , async (req , res) => {
        try{
            await req.user.remove()
            await res.status(200).send(req.user)
        }catch(e){
            res.status(500).send(e)
        }
    })
}

deleteProfile()


function deleteProfilePicture(){
    userRouter.delete('/profile/profilepicture' , auth , async (req , res) => {
        try{
            req.user.profile_picture = undefined
            await req.user.save()
            await res.status(200).send(req.user)
        }catch(e){
            res.status(500).send(e)
        }
    })
}

deleteProfilePicture()


function updateProfile(){
    userRouter.patch('/users' , auth , async (req , res) => {
        const keys = Object.keys(req.body)
        const allowsUpdates = ['name' , 'email' , 'phoneNumber' , 'password']
        //ckeck weather every key is exsited in allows array or not
        //every member in keys array must pass the exam
        // that it is existed in allow updates
        const valid = keys.every((update) => allowsUpdates.includes(update))
        if(!valid){
            return res.status(500).send('invalid updates')
        }
        try{
            keys.forEach( (update) => {
                req.user[update] = req.body[update]
            })
            await req.user.save()
            res.status(200).send(req.user)
        }catch(e){
            res.status(400).send(e)
        }
    })
}
updateProfile()



module.exports = userRouter
