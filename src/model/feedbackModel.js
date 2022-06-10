const mongoose = require('mongoose')
const random = require('mongoose-random')
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
feedbackSchema.plugin(random)
const model = new mongoose.model('feedback', feedbackSchema)
exports.feedback = model