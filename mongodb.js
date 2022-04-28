//const { mongodb , ObjectID } = require('mongodb')

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

//const mongoClient = mongodb.MongoClient 

const mongoConnection = 'mongodb://127.0.0.1:27017'
const databaseName = 'GP-demon'

//const id = new ObjectID()



MongoClient.connect(mongoConnection , {useNewUrlParser : true} , (error , client) => {
    if(error)
        {return console.log("unsuccessful")}

     const db = client.db(databaseName)

     db.collection('users').insertOne({
        name:"enas",
        age:22
    })  
})






    //  db.collection('names').deleteMany({
    //      name : "mane"
    //  }).then((result) => {
    //      console.log(result)
    //  }).catch((error) => {
    //      console.log(error)
    //  })


// db.collection('names').updateMany({
//     name : "Mohaed"
// } , {
//     $set : {
//         name : "Mohamed Salah"
//     }
// }).then((result) => {
//     console.log(result.modifiedCount)
// }).catch((error) => {
//     console.log(error)
// })


    // db.collection('names').updateOne({ _id : new ObjectID("5de55e4bb39b6d11d806138d")} , {
    //     $set : {
    //         name : "Mohamed Salah"
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    //  db.collection('names').find( { name : "salah"}).toArray/*.count*/( (error , users /*count*/ )=> {
    //         if(error){
    //             console.log("error")
    //         }
    //         console.log(users)
    //  })


    // db.collection('names').insertMany([
    //     {
    //         name: "salah" ,
    //         number : 11
    //     }, 
    //     {
    //         name : "mane" ,
    //         number : 10
    //     }
    // ] , (error , result ) => {
    //     if(error)
    //     {
    //         return console.log("error")
    //     }
    //     console.log(result.ops)

    // })