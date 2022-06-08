//required modules and packages
const usermodel = require('../model/userModel')
const { feedback } = require('../model/feedbackModel')

//feedback stuff

exports.feedback = async (req, res) => {
    try {
        const check_user_is_exist = await usermodel.findOne({ id: req.body.to })
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
            // console.log(" view : ",view)
        }
    } catch (error) {
        console.log(error.message)
    }
}