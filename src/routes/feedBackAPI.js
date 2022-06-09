const express = require('express')
const adminAuth = require('../middleware/adminAuth')
const joiValidation = require('../helper/joiValidation')
const fdBack = require('../controller/FeedbackController')
const messageFormat = require('../utils/messageFormat')

const router = express.Router()

router.post('/feedback', adminAuth,  (req, res) => {
    try {
        let { error } = joiValidation.userFeedback(req.body);
        if (error) {
            return res.status(400).send(messageFormat.validationFormat(error, 'Project', 400))
        }
        return fdBack.feedback(req, res)
    } catch (error) {
        return res.send(messageFormat.errorMsgFormat(error.message, 'Project'))
    }

})
router.get('/feedback/:id', adminAuth,   (req, res) => {
    try {
        return fdBack.viewFeedback(req, res)
    } catch (error) {
        return res.send(messageFormat.errorMsgFormat(error.message, 'Project'))
    }

})     //id is a objectId of userModel MongoDB id (to address)
router.get('/feedback', adminAuth,    (req, res) => {
    try {
        return fdBack.allFeedback(req, res)
    } catch (error) {
        return res.send(messageFormat.errorMsgFormat(error.message, 'Project'))
    }

}) 
// router.get('/allfeedback',adminAuth,fee.allFeedback)

module.exports = router