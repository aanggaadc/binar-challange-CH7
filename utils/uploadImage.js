const multer = require('multer')
const directory = __dirname + "/../public/avatar"
const filter = (req, file, cb) => {
    if (
        file.mimetype.includes('image/jpg') || file.mimetype.includes('image/jpeg') || file.mimetype.includes('image/png')) {
        cb(null, true)
    }else{
        cb(new Error('Harap Upload File dengan Format JPG, JPEG, dan PNG'))
    }
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, directory)
    },
    filename: function (req, file, cb){
        const randomNumber = Math.round(Math.random() * 1000)
        cb(null, `avatar-${randomNumber}.${file.originalname.split('.').pop()}`)
    }
})

let uploadImage = multer({
    storage: storage,
    fileFilter: filter
})

module.exports = uploadImage