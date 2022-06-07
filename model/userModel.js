const { string } = require('joi')
const mongoose = require('mongoose')

const userModelSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    profilePhoto: {
        fileName: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            required: true
        },
        fileSize: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now()
        }
    },
    password:{
        type:String,
        required: true
    },
    // role 1 is developer
    role: {
        type: Number,
        required: true
    }
})

const model = new mongoose.model('user', userModelSchema)
exports.usermodel = model