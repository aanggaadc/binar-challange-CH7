const router = require('express').Router()
const isLoggedIn = require('../middleware/authentication')
const{
    Index,
    SignUp,
    Login,
    Game,
    Dashboard,
    EditBiodata,
    EditBiodataFunction,
    EditAccount,
    EditAccountFunction
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
router.get('/editAccount/:id', EditAccount)
router.get('/editBiodata/:id', EditBiodata)
router.get('/dashboard', Dashboard)
router.post('/signup', RegisterFunction)
router.post('/login', LoginFunction)
router.post('/logout', LogoutFunction)
router.post('/editBiodata/:id', EditBiodataFunction)
router.post('/editAccount/:id', EditAccountFunction)



module.exports = router