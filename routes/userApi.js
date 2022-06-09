const express = require('express')
const multer = require('multer')
const uploader = require('../middleware/fileUploadHelper')
const user = require('../controller/UserController')
const adminAuth = require('../middleware/adminAuth')
const fdBack = require('../controller/FeedbackController')
const joiValidation = require('../helper/joiValidation')
const router = express.Router()
const messagFormat = require('../utils/messageFormat')

const fileUploader = multer({ storage: uploader.fileStorage, fileFilter: uploader.fileFilter })

router.post('/register', fileUploader.single('profile_image'), user.signup)
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
router.delete('/logout', adminAuth, user.logout)
router.patch('/update_details', user.update)

module.exports = router