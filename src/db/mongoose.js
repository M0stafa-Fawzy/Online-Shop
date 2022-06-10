const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, (err) => {
    if(err) return console.log({err});
    console.log("connected");
})