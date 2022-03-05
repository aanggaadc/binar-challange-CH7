const router = require('express').Router()
const {
    isLoggedIn,
    isLoggedInAsAdmin
} = require('../middleware/authentication')
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
router.get('/editAccount/:id',isLoggedIn, EditAccount)
router.get('/editBiodata/:id', isLoggedIn, EditBiodata)
router.get('/dashboard', isLoggedInAsAdmin,  Dashboard)
router.post('/signup', RegisterFunction)
router.post('/login', LoginFunction)
router.post('/logout', isLoggedIn, LogoutFunction)
router.post('/editBiodata/:id', isLoggedIn, EditBiodataFunction)
router.post('/editAccount/:id', isLoggedIn, EditAccountFunction)



module.exports = router