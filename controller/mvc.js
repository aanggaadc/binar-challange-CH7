const jwt = require('jsonwebtoken')

// --------------------------------GAME CONTENT------------------------------------//
const Index = async (req, res) =>{
    const token = req.cookies.jwt

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        res.locals.user = decodedToken
    })

    res.render('index', {
        pageTitle: "Landing Page",
        token
    })
}

const SignUp = async (req, res) => { 
    const{success, error} = req.flash()  
    res.render('signup', {
        pageTitle : "Sign Up",
        success: success,
        error: error        
    })
}

const Login = async (req, res) => {
    const{success, error} = req.flash()
    res.render('login', {
        pageTitle: "LOGIN",
        success: success,
        error: error
    })
}

const Game = async (req, res) => {
    res.render('game', {
        pageTitle: "PLAY GAME"
    })
}

module.exports ={
    Index,
    SignUp,
    Login,
    Game
}