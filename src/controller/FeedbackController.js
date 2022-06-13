//required modules and packages
const usermodel = require('../model/userModel')
const { feedback } = require('../model/feedbackModel')
const { StatusCodes } = require('http-status-codes')
const messageFormat = require('../utils/messageFormat')
const { usertoken } = require("../model/JwtToken")
const jwt = require("jsonwebtoken")
//feedback stuff

exports.postThefeedback = async (req, res) => {
    try {
        let request = req.body
        let feedbackFrom = await jwt.verify(req.headers.authorization, "secret")
        let check_user_is_exist = await usermodel.findOne({ _id: request.to })
        if (!check_user_is_exist) {
            return res.status(StatusCodes.NOT_FOUND).json(
                messageFormat.errorMsgFormat("address of the receiver is not a registered user ,"),
                'login',
                StatusCodes.NOT_FOUND)
        }
        else {
            //save the feedback
            console.log("feedbackFrom : ",feedbackFrom.id)
            let feedback_payload = new feedback({
                from: feedbackFrom.id,
                to: req.body.to,
                feedback: req.body.feedback
            })
            await feedback(feedback_payload).save()
            // let response = await usermodel.({ userEmail: to, feedback })
            return res.status(StatusCodes.OK).send(
                messageFormat.successFormat(feedback_payload.feedback,
                    'feedback',
                    StatusCodes.OK,
                    `your feedback about ${check_user_is_exist.userName} is posted successfully`
                ))
        }
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(
            messageFormat.errorMsgFormat(
                error.message,
                'feedback',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.viewFeedbackForParticularUser = async (req, res) => {
    try {
        let feedbackList = []
        if (req.params.id) {
            let view = await feedback.find({ to: req.params.id })
            let i = 0;
            let find_user = await usermodel.findOne({ _id: req.params.id })
            while (i < view.length) {
                feedbackList.push(view[i].feedback)
                i++;
            }
            let feedbackdetails = {
                DeveloperName: find_user.userName,
                feedback_about_the_deloper: feedbackList
            }
            return res.status(StatusCodes.OK).send(messageFormat.successFormat(
                feedbackdetails.DeveloperName,
                'viewfeedback',
                StatusCodes.OK,
                { feedback: feedbackdetails.feedback_about_the_deloper }))
        }
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormat.errorMsgFormat(
            error.message,
            'viewfeedback',
            StatusCodes.BAD_REQUEST))
    }
}

exports.viewAllTheFeedback = async (req, res) => {
    try {
        let response = await feedback.aggregate([{ $project: { _id: 0, to: 1, feedback: 1 } }])
        return res.status(StatusCodes.OK).send(messageFormat.successFormat(
            response,
            'viewAllTheFeedBack',
            StatusCodes.OK,
            "all the feedback about the developers"
        ))
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormat.errorMsgFormat(
            error.message,
            'viewAllTheFeedBack',
            StatusCodes.BAD_REQUEST
        ))
    }
}

exports.getRandomUsers = async (req, res) => {
    try {
        let verify_token = await jwt.verify(req.headers.authorization, "secret")
        let randomUserList = []
        let randomUser = await usermodel.findRandom().limit(3).select('_id userName')
        randomUser.forEach(response => {
            if (verify_token.id != response.id)
                randomUserList.push(response)
        });
        return res.status(StatusCodes.OK).send(messageFormat.successFormat(
            { response: randomUserList },
            'getRandomUsers',
            StatusCodes.OK,
            "random users from developers"
        ))
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormat.errorMsgFormat(
            error.message,
            'getRandomUsers',
            StatusCodes.BAD_REQUEST
        ))
    }
}