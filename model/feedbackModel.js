const { required } = require('joi')
const mongoose = require('mongoose')

const feedbackSchema = mongoose.Schema({

    from: {
        type: mongoose.Schema.Types.Object,
        ref:'user',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.Object,
        ref:'user',
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    feedback_posted_time: {
        type: Date,
        default: Date.now()
    }

})

const model = new mongoose.model('feedback', feedbackSchema)
exports.feedback = model