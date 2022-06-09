const express = require('express')
const multer = require('multer')
const uploader = require('../middleware/fileUploadHelper')
const user = require('../controller/UserController')
const adminAuth = require('../middleware/adminAuth')
const fdBack = require('../controller/FeedbackController')
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
        return user.signup(req, res)
    } catch (error) {
        return res.send(messagFormat.errorMsgFormat(error.message, 'register'))
    }

})
router.post('/login', (req, res) => {
    try {
        let { error } = joiValidation.login(req.body);
        if (error) {
            return res.status(400).send(messagFormat.validationFormat(error, 'Project', 400))
        }
        return user.login(req, res)
    } catch (error) {
        return res.send(messagFormat.errorMsgFormat(error.message, 'Project'))
    }

})
router.delete('/logout', adminAuth, (req, res) => {
    try {
        return user.logout(req, res)
    } catch (error) {
        return res.send(messagFormat.errorMsgFormat(error.message, 'Project'))
    }
})

module.exports = router