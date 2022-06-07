const mongoose = require('mongoose')

const feedbackSchema = mongoose.Schema({
    feedback: {
        from: String,
        to: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        feedback_posted_time: {
            type: Date,
            default: Date.now()
        }
    }
})

const model = new mongoose.model('feedback', feedbackSchema)
exports.feedback = model