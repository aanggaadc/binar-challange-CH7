const router = require('express').Router()
const isLoggedIn = require('../middleware/authentication')
const{
    Index,
    SignUp,
    Login,
    Game,
    Dashboard,
    EditBiodata,
    EditBiodataFunction
} = require('../controller/mvc')

const {
    RegisterFunction,
    LoginFunction,
    LogoutFunction
} = require('../controller/mcr')


router.get('/', Index)
router.get('/signup', SignUp)
router.get('/login', Login)
router.get('/game', isLoggedIn, Game)
router.get('/editBiodata/:id', EditBiodata)
router.get('/dashboard', Dashboard)
router.post('/signup', RegisterFunction)
router.post('/login', LoginFunction)
router.post('/logout', LogoutFunction)
router.post('/editBiodata/:id', EditBiodataFunction)



module.exports = router