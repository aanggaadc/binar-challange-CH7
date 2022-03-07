const jwt = require('jsonwebtoken')
const bcrypt = require ('bcrypt')
const fs = require('fs')
const {
    user_game,
    user_game_biodata,
    user_game_history,
    file
} = require('../models')

// --------------------------------GAME CONTENT------------------------------------//
const Index = async (req, res) =>{
    const{success, error} = req.flash()  
    const token = req.cookies.jwt

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        res.locals.user = decodedToken
    })

    if(token){
        const findUser = await user_game.findOne({
            where: {
                uuid: res.locals.user.user_id
                
            },
            include: "avatar"
        })

        res.render('index', {
            pageTitle: "Landing Page",
            token,
            data: findUser,
            success: success,
            error: error 
        }) 
    }else{
        res.render('index', {
            pageTitle: "Landing Page",
            token,
            success: success,
            error: error 
        }) 
    }     
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

const SignupFunction = async (req, res) => {
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
            res.redirect('/login')
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
            },
            include: "avatar"
        })

        console.log(findUser.avatar)

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
                },
                include: "avatar"
            })  
            const hashedPassoword = await bcrypt.hash(password1, 10)

            if(req.file){
                await file.create({
                    file_url: `/avatar/${req.file.filename}`,
                    file_name: req.file.filename,
                    file_size: req.file.size,
                    original_filename: req.file.originalname,
                    user_game_uuid: findUser.uuid
                })
    
                if(findUser.avatar){
                    await file.destroy({
                        where: {
                            uuid: findUser.avatar.uuid
                        }
                    })
                    fs.rmSync(__dirname + '/../public' + findUser.avatar.file_url)
                }
            }

            const updateUser = await user_game.update({
                username,
                email,
                role : findUser.role,
                password: password1 == "" && password2 =="" ? findUser.password : hashedPassoword
            }, {where:{
                uuid: req.params.id
            }})
            
            if(updateUser){
                req.flash('success', 'Account Updated Successfully')
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

const LogoutFunction = (req, res ) => {        
    try {
        res.cookie('jwt', '', {maxAge:1})
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }        
}


// --------------------------------DASHBOARD------------------------------------//


const Dashboard = async (req, res, next) => {
    try {
    const{success, error} = req.flash()
    const page = Number(req.query.page) || 1
    const itemPerPage = 10  
    const token = req.cookies.jwt
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        res.locals.user = decodedToken
    })

    const userGameList = await user_game.findAndCountAll({
        include: ['user_biodata', 'user_history'],
        limit: itemPerPage,
        offset: (page-1) * itemPerPage
    })

    if(token){
        const findUser = await user_game.findOne({
            where: {
                uuid: res.locals.user.user_id
                
            },
            include: "avatar"
        })

        res.render('dashboard',{
            pageTitle: "GAME DASHBOARD",
            token,
            data: findUser,
            dataUser : userGameList.rows,
            currentPage: page,
            totalPage: Math.ceil(userGameList.count / itemPerPage),
            nextPage: page + 1,
            prevPage: (page-1) == 0 ? 1 : (page-1), 
            success: success,
            error: error
        })
    }else {
        res.render('dashboard',{
            pageTitle: "GAME DASHBOARD",
            token,
            dataUser : userGameList.rows,
            currentPage: page,
            totalPage: Math.ceil(userGameList.count / itemPerPage),
            nextPage: page + 1,
            prevPage: (page-1) == 0 ? 1 : (page-1), 
            success: success,
            error: error
        })
    }    
    } catch (error) {
        console.log(error)
        next()
    }  
}

const DashboardBiodata = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            res.locals.user = decodedToken
        })
    
        const userBiodata = await user_game_biodata.findAll({
            include: 'user_game'
        })
        
        if(token){
            const findUser = await user_game.findOne({
                where: {
                    uuid: res.locals.user.user_id
                    
                },
                include: "avatar"
            })
    
            res.render('dashboard-biodata',{
                pageTitle: "USERS BIODATA",
                token,
                data: findUser,
                dataUser : userBiodata
            }) 
        }else{
            res.render('dashboard-biodata',{
                pageTitle: "USERS BIODATA",
                token,
                dataUser : userBiodata
            })
        }        
        } catch (error) {
            console.log(error)
            next()
        } 
}

const DashboardHistory = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            res.locals.user = decodedToken
        })
    
        const userHistory = await user_game_history.findAll({
            include: 'user_game'
        })

        if(token){
            const findUser = await user_game.findOne({
                where: {
                    uuid: res.locals.user.user_id
                    
                },
                include: "avatar"
            })
    
            res.render('dashboard-history',{
                pageTitle: "USERS HISTORY",
                token,
                data: findUser,
                dataUser : userHistory
            })
        
        }else{
            res.render('dashboard-history',{
                pageTitle: "USERS HISTORY",
                token,
                dataUser : userHistory
            })
        }
        
        } catch (error) {
            console.log(error)
            next()
        } 
}

DashboardCreate = async (req, res, next) => {
    try {
        const{success, error} = req.flash()  
        res.render('dashboard-create', {
            pageTitle : "Create New Data User",
            success: success,
            error: error
        })
    } catch (error) {
        console.log(error)
        next()
    }
}

const DashboardEdit = async (req, res, next) => {
    try {
        const findUser = await user_game.findOne({
            where: {
                uuid: req.params.id
            },
            include: ['user_biodata', 'user_history']
        })

        if(findUser){
            res.render('dashboard-edit', {
                data: findUser,
                pageTitle: "Edit User Data"
            })
        }else{
            next()
        }        
    } catch (error) {
        console.log(error)
        next()
    }
}

const DashboardCreateFunction = async (req, res, next) => {
    try {
        const {full_name, username, email, password1, password2, role, city, date_of_birth, hobby, address} =req.body

        if(password1 != password2){
            req.flash('error', 'Password Yang Anda Masukkan Tidak Sama')
            res.redirect('/dashboard/create')
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
                address,
                hobby,
                city,
                date_of_birth,
                user_game_uuid: newUser.uuid
            })

        }
        req.flash('success', 'User Data Created Successfully')
        res.redirect('/dashboard')
    } catch (error) {
        req.flash('error', error.message)
        console.log(error)
        res.redirect('/dashboard/create')
    }
}

const DashboardEditFunction = async (req, res, next) => {
    const {username, email, full_name, hobby, address, city, date_of_birth, win, lose, draw} = req.body
    try {      
      const findUserGame = await user_game.findOne({
          where: {
              uuid : req.params.id
          }
      })
      if (findUserGame) {      
          const findUserBiodata = await user_game_biodata.findOne({
              where: {
                user_game_uuid: req.params.id
              }
          })

          const updateUserBiodata = await findUserBiodata.update({
              full_name,
              hobby,
              address,
              city,
              date_of_birth
          })

          const findUserHistory = await user_game_history.findOne({
              where: {
                  user_game_uuid: req.params.id
              }
          })

          const updateUserHistory = await findUserHistory.update({
              win,
              lose,
              draw
          })

        const updateUser = await findUserGame.update({
          username,
          email
        })
       
        if(updateUser){
            req.flash('success', 'Data Successfully Updated')
            res.redirect('/dashboard')
        }
      } else {
        req.flash('error', 'User Not Found')
        res.redirect('/dashboard')
      }
    } catch (error) {
        req.flash('error', error.message)
        console.log(error)
        res.redirect('/')
    }  
}

DashboardDeleteFunction = async (req, res, next) => {
    try {  
        const findUserGame = await user_game.findOne({
            where: {
                uuid : req.params.id
            },
            include: "avatar"
        })
        if (findUserGame) {
            
            if(findUserGame.avatar){
                await file.destroy({
                    where: {
                        uuid: findUserGame.avatar.uuid
                    }
                })
                fs.rmSync(__dirname + '/../public' + findUserGame.avatar.file_url)
            }
          await user_game_history.destroy({
              where: {
                user_game_uuid: req.params.id
              }
            })
  
          await user_game_biodata.destroy({
              where: {
                user_game_uuid: req.params.id
              }
            })
  
          await user_game.destroy({
            where: {
              uuid: req.params.id
            }
          })

          req.flash('success', 'Data Successfully Deleted')
          res.redirect('/dashboard') 
        } else {
            req.flash('error', 'User Not Found')
            res.redirect('/dashboard')
        }
      } catch (error) {
        req.flash('error', error.message)
        console.log(error)
        res.redirect('/dashboard')
      }  
}

module.exports = {
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
}