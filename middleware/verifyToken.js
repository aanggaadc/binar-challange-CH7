const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/error')

const verifyToken = (req, res, next) => {
    try {
        let tokenHeader = req.headers['authorization']

        if(!tokenHeader){
            return errorHandler(401, "No Token Provided", res)
        }else{
            let token = tokenHeader.split(' ')[1]

            jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
                if(error){
                    return errorHandler(403, error.message, res)  
                }else{
                    req.user = decodedToken
                    next()
                }
            })
        }
    } catch (error) {
        console.log(error)
        return errorHandler(400, error.message, res)  
    }
}

module.exports = verifyToken