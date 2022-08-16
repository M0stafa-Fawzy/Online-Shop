const Users = require('../../models/user')
const jwt = require('jsonwebtoken')


const auth = async (req , res , next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const verified = jwt.verify(token , process.env.JWT_KEY)
        const user = await Users.findOne({_id : verified._id })

        if(!user){
            throw new Error()
        }

        req.user = user
        next()
    }catch (e) {
        res.status(401).send('Please Auth!')
    }
    
}

module.exports = auth