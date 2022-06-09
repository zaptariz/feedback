//required modules and packages
const usermodel = require('../model/userModel')
const { feedback } = require('../model/feedbackModel')
const joiValidation = require('../helper/joiValidation')


//feedback stuff

exports.feedback = async (req, res) => {
    try {
        const request = await joiValidation.userFeedback.validateAsync(req.body)
        console.log(" request : ", request)
        const check_user_is_exist = await usermodel.findOne({_id: request.to })
        if (!check_user_is_exist) {
            console.log(" address of the receiver is not a registered user ")
            res.json("address of the receiver is not a registered user ")
        }
        else {
            //save the feedback
            const feedback_payload = new feedback({
                from: req.body.from,
                to: req.body.to,
                feedback: req.body.feedback
            })
            await feedback(feedback_payload).save()
            console.log(" payload: ", feedback_payload)
            // let response = await usermodel.({ userEmail: to, feedback })
            res.status(200).send({
                status: " SUCCESS",
                response: `your feedback about ${check_user_is_exist.userName} is posted successfully`
            })
        }
    } catch (error) {
        console.log("error response : ", error.message)
        return res.status(401).send({
            status: 'failed',
            response: error.message
        })
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
            res.status(200).send({ DeveloperName: find_user.userName, feedback_about_the_deloper: feedbackList })
        }
    } catch (error) {
        console.log(error.message)
        res.status(200).send({ error: error.message })
    }
}

exports.allFeedback = async (req,res) =>{
    try {
        let response = await feedback.aggregate([{$project:{_id: 0, to: 1, feedback:1}}])
        let i =0
        while(i<response.length){
            allFeedBack.push(response[i])
            i++
        }
        res.status(200).send({allFeedBack})
    } catch (error) {
        res.status(401).send({
            status: " Failure",
            response: error.message
        })
    }
}