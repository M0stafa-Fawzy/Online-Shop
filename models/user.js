require('../src/db/mongoose')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type : String, 
        require : true
    }, email: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ('please enter a correct email')
            }
        }
    }, password: {
        type: String,
        required: true,
        minlength: 7

    }, phoneNumber: {
        type: String,
        default : null,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isMobilePhone(value, ["ar-EG"])){
                throw new Error ("Please Enter a Correct Phone Number")
            }
        }
    } , role : {
        required : true , 
        type : String
    } , profile_picture : {
        type : Buffer 
    } , tokens : [{
        token : {
            type : String , 
            required : true
        }
    }] , carts : [{
        cart : {
            type : mongoose.Schema.Types.ObjectId , 
            ref : 'products'
        }
    }]
}, {
    timestamps: true
})

userSchema.statics.findUser = async(email , password) =>{
    const user = await Users.findOne({email})
    if(!user){
        throw new Error("User Doesn't Exist")
    }
    const match = await bcrypt.compare(password , user.password)
    if(!match){
        throw new Error("Wrong Password!. Please Confirm Password")
    }
    return user
}

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({_id : this._id.toString()} , 'onlineShopJWT')
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token

}

userSchema.pre('save' , async function (next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password , 8)
    }
    next()
})


const Users = mongoose.model('users',userSchema )

module.exports = Users

