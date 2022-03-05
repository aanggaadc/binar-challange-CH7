const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/error')
const {
    user_game,
    user_game_history,
    user_game_biodata
} = require('../models')


const RegisterFunction = async (req, res) => {
    try {
        const {full_name, username, email, password1, password2, role} =req.body

        if(password1 != password2){
            req.flash('error', 'Password Yang Anda Masukkan Tidak Sama')
            res.redirect('/signup')
            return
        }else{
            const hashedPassword = await bcrypt.hash(password1, 10)
            const newUser = await user_game.create({
                username,
                email,
                role,
                password: hashedPassword
            })

            await user_game_history.create({
                user_game_uuid :newUser.uuid
            })

            await user_game_biodata.create({
                full_name,
                user_game_uuid: newUser.uuid
            })

        }
        req.flash('success', 'User Registered Successfully')
        res.redirect('/login')
    } catch (error) {
        req.flash('error', error.message)
        console.log(error)
        res.redirect('/signup')
    }
}

const LoginFunction = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email){
            req.flash('error', 'Please Insert Email')
            res.redirect('/login')
        }
        const user = await user_game.findOne({
            where: {
                email: email
            }
        })

        if(!user){
            req.flash('error', 'Email Not Found')
        }

        let validPassword = bcrypt.compareSync(password, user.password)

        if(!validPassword){
            req.flash('error', 'Incorrect Password')
            res.redirect('/login')
        }else {
            let token = jwt.sign({
                user_id : user.uuid,
                role: user.role,
                username: user.username
            }, 
            process.env.JWT_SECRET,
            {
                expiresIn: 1000*60*60*24
            }
            )
            res.cookie('jwt', token, {maxAge: 1000*60*60*24})
            res.redirect('/')
        }       
    } catch (error) {
        console.log(error)
    }
}

const LogoutFunction = (req, res ) => {        
    try {
        res.cookie('jwt', '', {maxAge:1})
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
        
}

module.exports = {
    RegisterFunction,
    LoginFunction,
    LogoutFunction
}