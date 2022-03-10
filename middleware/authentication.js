const jwt = require('jsonwebtoken')

const isLoggedIn = (req, res, next) => {
    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token, 'secret', (err, decodedToken) => {
            if(err){
                res.locals.user = null
                req.flash('error', 'Token is Expired')
                res.redirect('/login')
            }else{
                res.locals.user = decodedToken
                console.log("Token Is :")
                console.log(decodedToken)
                next()
            }
        })        
    } else {
        res.locals.user = null
        req.flash('error', "You're not Login, Please Login")
        res.redirect('/login')
    }
}

const isLoggedInAsAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, "secret", (err, decodedToken) => {
        if (err) {
            req.flash('error', 'Token is Expired')
            res.redirect('/login')
        } else {
          if (decodedToken.role !== 'SuperAdmin') {
            req.flash('error', "You're Not Login As Admin")
            res.redirect("/");
          } else {
            res.locals.user = decodedToken
            console.log("Token Is :")
            console.log(decodedToken)
            next()
          }
        }
      });
    } else {
        res.locals.user = null
        req.flash('error', "You're not Login, Please Login")
        res.redirect('/login')
    }
  }

  const checkNotAuthenticated = ( req, res , next ) =>{
    const token = req.cookies.jwt;

    if(token){
      res.redirect('/')
    }else{
      next()
    }

  }

module.exports = {
    isLoggedIn, 
    isLoggedInAsAdmin,
    checkNotAuthenticated
}