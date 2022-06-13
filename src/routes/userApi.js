const express = require('express')
const multer = require('multer')
const uploader = require('../middleware/fileUpload')
const userController = require('../controller/UserController')
const adminAuth = require('../middleware/adminAuth')
const joiValidation = require('../helper/joiValidation')
const router = express.Router()
const messagFormat = require('../utils/messageFormat')
const { StatusCodes } = require('http-status-codes')

const fileUploader = multer({ storage: uploader.fileStorage, fileFilter: uploader.fileFilter })

//Routers request body validated by joi

router.post('/register', fileUploader.single('profile_image'),  (req, res) => {
    try {
        let { error } = joiValidation.registerSchema(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).send(messagFormat.validationFormat(error, 'register', StatusCodes.BAD_REQUEST))
        }
        return userController.signup(req, res)
    } catch (error) {
        return res.send(messagFormat.errorMsgFormat(error.message, 'register'))
    }

})
router.post('/login', (req, res) => {
    try {
        let { error } = joiValidation.login(req.body);
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).send(messagFormat.validationFormat(error, 'login', StatusCodes.BAD_REQUEST))
        }
        return userController.login(req,res)
    } catch (error) {
        return res.send(messagFormat.errorMsgFormat(error.message, 'login',StatusCodes.BAD_REQUEST))
    }

})
router.delete('/logout', adminAuth, (req, res) => {
    try {
        return userController.logout(req, res)
    } catch (error) {
        return res.send(messagFormat.errorMsgFormat(error.message, 'logout'))
    }
})

module.exports = router