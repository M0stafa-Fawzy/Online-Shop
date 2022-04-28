const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'liverpoolynwa',
    database: 'onlineshop'
})

module.exports = connection

// const id = new mongoose.Types.ObjectId()
// const token = jwt.sign({id}, process.env.JWT_KEY)
// const q = `insert into users values
// ('${req.body.name}', '${id}', '${req.body.password}', '${req.body.email}', '${token}')
// `
// db.query(q, (err, result) => {
//     if (err) res.send(err)
//     res.status(201).json(result)
// })

// db.query('select * from users', async (err, result) => {
//     if (err) return new Error()
//     res.json(result.length)
// })



