const express = require('express')
const multer = require('multer')
const uploader = require('../middleware/fileUploadHelper')
const user = require('../controller/UserController')
const adminAuth = require('../middleware/adminAuth')

const router = express.Router()

const fileUploader = multer({storage:uploader.fileStorage, fileFilter:uploader.fileFilter})

router.post('/signup',fileUploader.single('profile_image'),user.signup )
router.post('/signin',user.signin )

module.exports =router