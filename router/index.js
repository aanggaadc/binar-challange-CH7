const router = require('express').Router()
const {
    isLoggedIn,
    isLoggedInAsAdmin
} = require('../middleware/authentication')
const verifyToken = require('../middleware/verifyToken')
const{
    Index,
    SignUp,
    Login,
    Game,
    SignupFunction,
    LoginFunction,
    LogoutFunction,
    Dashboard,
    DashboardCreate,
    DashboardCreateFunction,
    EditBiodata,
    EditBiodataFunction,
    EditAccount,
    EditAccountFunction,
    DashboardEdit,
    DashboardBiodata,
    DashboardHistory,
    DashboardEditFunction,
    DashboardDeleteFunction
} = require('../controller/mvc')

const {
    RegisterAPI,
    LoginAPI,
    CreateRoom,
    PlayGameRoom
} = require('../controller/mcr')


// ----------------------------------- MVC ROUTE-------------------------------------//
router.get('/', Index)
router.get('/signup', SignUp)
router.get('/login', Login)
router.get('/game', isLoggedIn, Game)
router.get('/editAccount/:id',isLoggedIn, EditAccount)
router.get('/editBiodata/:id', isLoggedIn, EditBiodata)
router.get('/dashboard', isLoggedInAsAdmin,  Dashboard)
router.get('/dashboard/create', isLoggedInAsAdmin, DashboardCreate)
router.get('/dashboard/biodata', isLoggedInAsAdmin, DashboardBiodata)
router.get('/dashboard/history', isLoggedInAsAdmin, DashboardHistory)
router.get('/dashboard/edit/:id', isLoggedInAsAdmin, DashboardEdit)
router.post('/signup', SignupFunction)
router.post('/login', LoginFunction)
router.post('/logout', isLoggedIn, LogoutFunction)
router.post('/dashboard/create', isLoggedInAsAdmin, DashboardCreateFunction)
router.post('/editBiodata/:id', isLoggedIn, EditBiodataFunction)
router.post('/editAccount/:id', isLoggedIn, EditAccountFunction)
router.post('/dashboard/edit/:id', isLoggedInAsAdmin, DashboardEditFunction)
router.post('/dashboard/delete/:id', isLoggedInAsAdmin, DashboardDeleteFunction)

// ----------------------------------- MCR ROUTE-------------------------------------//
router.post('/api/register', RegisterAPI)
router.post('/api/login', LoginAPI)
router.post('/api/room/create', verifyToken, CreateRoom)
router.post('/api/room/play',verifyToken, PlayGameRoom)


module.exports = router