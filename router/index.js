const router = require('express').Router()
const{
    Index,
    SignUp,
    Login,
    Game
} = require('../controller/mvc')

const {
    RegisterFunction,
    LoginFunction,
    LogoutFunction
} = require('../controller/mcr')


router.get('/', Index)
router.get('/signup', SignUp)
router.get('/login', Login)
router.get('/game', Game)
router.post('/signup', RegisterFunction)
router.post('/login', LoginFunction)
router.post('/logout', LogoutFunction)


module.exports = router