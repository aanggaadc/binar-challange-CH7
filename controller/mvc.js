
// --------------------------------GAME CONTENT------------------------------------//
const Index = async (req, res) =>{
    res.render('index', {
        pageTitle: "Landing Page"
    })
}

const SignUp = async (req, res) => {
    res.render('signup', {
        pageTitle : "Sign Up"
    })
}

const Login = async (req, res) => {
    res.render('login', {
        pageTitle: "LOGIN"
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