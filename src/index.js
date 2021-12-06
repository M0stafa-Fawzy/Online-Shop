const express = require('express')
//const h = require('bcryptjs')
const app = express()
app.use(express.json())

const userRouter = require('../routes/userRoute')
app.use(userRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT , () => {
    console.log('running on port ' + PORT)
})

// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')
// async function g () {
// const p = "efdetgrf" 
// const ph = await h.hash(p , 8) 
// console.log(ph)

// const t = await h.compare(p,ph)
// console.log(t)
// }
// g()



//let arr = [{name : 'mo' ,  age : 25} , {name : 'mr' ,  age : 26} , {name : 'wdf',  age : 27} , {name : 'wefad',  age : 29} ]

// console.log(arr)

// arr = arr.filter( (a) => {
//     if(a.name !== "mo"){
//         return a.name
//     }
// })

// console.log(arr)


// const ar = [1,2,3,4,5,6]
// console.log(ar.includes(1))














