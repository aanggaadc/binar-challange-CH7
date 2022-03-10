require('dotenv').config()
const express = require('express')
const app = express()
const router = require('./router')
const db = require('./models/index.js')
const PORT = process.env.PORT
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const {user_game} = require('./models')
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(cookieParser())
app.use(router)
app.use(async (req, res, next) => {
    const token = req.cookies.jwt

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        res.locals.user = decodedToken
    })

    if(token){
        const findUser = await user_game.findOne({
            where: {
                uuid: res.locals.user.user_id
                
            },
            include: "avatar"
        })

        res.status(404).render('404notfound', {
            pageTitle: "Page Not Found",
            token,
            data: findUser
        }) 
    }else{
        res.status(404).render('404notfound', {
            pageTitle: "Page Not Found",
            token
        })
    }    
})

db.sequelize.sync({
    // force:true
}).then(() => {
    console.log('Database Connected');
    app.listen(PORT, () => {
        console.log(`Server is Running at PORT ${PORT}`)
    })
}).catch((error) => {
    console.log(error)
})
