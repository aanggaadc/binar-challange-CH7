const jwt = require('jsonwebtoken')
const bcrypt = require ('bcrypt')
const {
    user_game,
    user_game_biodata
} = require('../models')

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

const EditBiodata = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        res.locals.user = decodedToken
        })

        const findUser = await user_game.findOne({
            where: {
                uuid: req.params.id
            },
            include: 'user_biodata'
        })

        if(findUser){
            res.render('editBiodata', {
                data: findUser,
                pageTitle: "Edit User Biodata",
                token
            })
        }else{
            next()
        }
    } catch (error) {
        next()
    }
}

const EditBiodataFunction = async (req, res) => {
    const{full_name, address, city, hobby, date_of_birth} = req.body

    try { 
            const findBiodata = await user_game_biodata.findOne({
                where:{
                    user_game_uuid: req.params.id
                }
            })
            
            const updateUserBiodata = await user_game_biodata.update({
                full_name,
                address,
                city,
                hobby,
                date_of_birth
            },{where:{
                user_game_uuid: req.params.id
            }})

            if(updateUserBiodata){
                req.flash("success", "Biodata Updated")
                res.redirect('/')
            }            
    } catch (error) {
        req.flash('error', error.message)
        console.log(error)
        res.redirect('/')
    }
}

const EditAccount = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        res.locals.user = decodedToken
        })

        const findUser = await user_game.findOne({
            where: {
                uuid: req.params.id
            }
        })

        if(findUser){
            res.render('editAccount', {
                data: findUser,
                pageTitle: "Edit User Account",
                token
            })
        }else{
            next()
        }
    } catch (error) {
        next()
    }
}

const EditAccountFunction = async (req, res) => {
    try {
        const{uuid} = req.params.id
        const {username, email, password1, password2} =req.body

        if(password1 != password2){
            req.flash('error', 'Password Yang Anda Masukkan Tidak Sama')
            res.redirect(`/editAccout/${uuid}`)
            return
        }else{
            const findUser = await user_game.findOne({
                where: {
                    uuid: req.params.id
                }
            })
            const hashedPassoword = await bcrypt.hash(password1, 10)
            const updateUser = await user_game.update({
                username,
                email,
                role : findUser.role,
                password: password1 == "" && password2 =="" ? findUser.password : hashedPassoword
            }, {where:{
                uuid: req.params.id
            }})
            
            if(updateUser){
                req.flash('success', 'User Registered Successfully')
                res.redirect('/')
            }
        }      
    } catch (error) {
        req.flash('error', error.message)
        console.log(error)
        res.redirect('/')
    }
}

const Game = async (req, res) => {
    res.render('game', {
        pageTitle: "PLAY GAME"
    })
}


// --------------------------------DASHBOARD------------------------------------//


const Dashboard = async (req, res) => {
    try {
    const token = req.cookies.jwt
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        res.locals.user = decodedToken
    })

    const userGameList = await user_game.findAll({
        include: ['user_biodata', 'user_history']
    })

    res.render('dashboard',{
        pageTitle: "GAME DASHBOARD",
        token,
        data : userGameList
    })
    } catch (error) {
        console.log(error)
    }  
}

module.exports = {
    Index,
    SignUp,
    Login,
    Game,
    Dashboard,
    EditBiodata,
    EditBiodataFunction,
    EditAccount,
    EditAccountFunction
}