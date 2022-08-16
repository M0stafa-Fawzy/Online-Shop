const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, (err) => {
    if(err) return console.log({ message: err.message });
    console.log("connected");
})