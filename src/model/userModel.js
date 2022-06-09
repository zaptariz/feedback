const mongoose = require('mongoose')
const joi = require('joi')

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
    password: String,
    // role 1 is developer
    role: {
        type: Number,
        required: true
    }
})

const usermodel = new mongoose.model('user', userModelSchema)
module.exports = usermodel

///.select('to feedback').populate({path:to})//