const router = require('express').Router()
const{
    Index,
    SignUp,
    Login,
    Game
} = require('../controller/mvc')

router.get('/', Index)
router.get('/signup', SignUp)
router.get('/login', Login)
router.get('/game', Game)

module.exports = router