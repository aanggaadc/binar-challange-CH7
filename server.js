require('dotenv').config()
const express = require('express')
const app = express()
const router = require('./router')
const db = require('./models')
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(router)
app.use((req, res, next) => {
    res.status(404).render('404notfound', {
        pageTitle: "Page Not Found"
    })
})

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
