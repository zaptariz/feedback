const express = require('express')
const adminAuth = require('../middleware/adminAuth')
const fdBack = require('../controller/FeedbackController')

const router = express.Router()

router.post('/feedback', adminAuth, fdBack.feedback)
router.get('/feedback/:id', adminAuth, fdBack.viewFeedback)     //id is a objectId of userModel MongoDB id (to address)
router.get('/feedback', adminAuth, fdBack.allFeedback)
// router.get('/allfeedback',adminAuth,fee.allFeedback)

module.exports = router