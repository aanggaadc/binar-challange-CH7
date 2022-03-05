require('dotenv').config()
const express = require('express')
const app = express()
const db = require('./models')
const PORT = process.env.PORT

app.use(express.json())

db.sequelize.sync({
    force:true
}).then(() => {
    console.log('Database Connected');
    app.listen(PORT, () => {
        console.log(`Server is Running at PORT ${PORT}`)
    })
}).catch((error) => {
    console.log(error)
})
