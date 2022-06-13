const express = require('express')
const adminAuth = require('../middleware/adminAuth')
const joiValidation = require('../helper/joiValidation')
const feedBackController = require('../controller/FeedbackController')
const messageFormat = require('../utils/messageFormat')

const router = express.Router()

router.post('/postfeedback', adminAuth, (req, res) => {
    try {
        let { error } = joiValidation.userFeedback(req.body);
        if (error) {
            return res.status(400).send(messageFormat.validationFormat(error, 'Project', 400))
        }
        return feedBackController.postThefeedback(req, res)
    } catch (error) {
        return res.send(messageFormat.errorMsgFormat(error.message, 'Project'))
    }

})
router.get('/feedback/:id', adminAuth, (req, res) => {
    try {
        return feedBackController.viewFeedbackForParticularUser(req, res)
    } catch (error) {
        return res.send(messageFormat.errorMsgFormat(error.message, 'Project'))
    }

})

router.get('/getrandomuser', adminAuth, (req, res) => {
    try {
        return feedBackController.getRandomUsers(req, res)
    } catch (error) {
        return res.send(messageFormat.errorMsgFormat(error.message, 'randomuser'))
    }

})
module.exports = router

