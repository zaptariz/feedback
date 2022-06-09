//required modules and packages
const usermodel = require('../model/userModel')
const { feedback } = require('../model/feedbackModel')
const joiValidation = require('../helper/joiValidation')
const { StatusCodes } = require('http-status-codes')
const messageFormat = require('../utils/messageFormat')

//feedback stuff

exports.feedback = async (req, res) => {
    try {
        const request = await joiValidation.userFeedback.validateAsync(req.body)
        console.log(" request : ", request)
        const check_user_is_exist = await usermodel.findOne({ _id: request.to })
        if (!check_user_is_exist) {
            console.log(" address of the receiver is not a registered user ")
            return res.status(StatusCodes.NOT_FOUND).json(
                messageFormat.errorMsgFormat("address of the receiver is not a registered user ,"),
                'login',
                StatusCodes.NOT_FOUND)
        }
        else {
            //save the feedback
            const feedback_payload = new feedback({
                from: req.body.from,
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
        console.log("error response : ", error.message)
        return res.status(StatusCodes.BAD_REQUEST).send(
            messageFormat.errorMsgFormat(
                error.message,
                'feedback',
                StatusCodes.BAD_REQUEST
            ))
    }
}

exports.viewFeedback = async (req, res) => {
    try {
        let feedbackList = []
        if (req.params.id) {
            console.log("req.params.id :", req.params.id)
            const view = await feedback.find({ to: req.params.id })
            console.log("View:", view)
            let i = 0;
            let find_user = await usermodel.findOne({ _id: req.params.id })
            console.log("find_user", find_user)
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
                feedbackdetails.feedbackList))
        }
    } catch (error) {
        console.log(error.message)
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormat.errorMsgFormat(
            error.message,
            'viewfeedback',
            StatusCodes.BAD_REQUEST))
    }
}

exports.allFeedback = async (req, res) => {
    try {
        let response = await feedback.aggregate([{ $project: { _id: 0, to: 1, feedback: 1 } }])
        // let i = 0
        // while (i < response.length) {
        //     allFeedBack.push(response[i])
        //     i++
        // }
        return res.status(StatusCodes.OK).send(messageFormat.successFormat(
            response,
            'allFeedBack',
            StatusCodes.OK,
            "all the feedback about the developers"
        ))
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(messageFormat.errorMsgFormat(
            error.message,
            'allFeedBack',
            StatusCodes.BAD_REQUEST
        ))
    }
}