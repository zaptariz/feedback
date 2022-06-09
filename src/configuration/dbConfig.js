const mongoose = require('mongoose')
const express = require('express')
const {config} = require('./config')
require('dotenv').config()

const application = express()

exports.db = () => {
    try {
        mongoose.connect(config.dbConnection + config.database, (error, response) => {
            console.log(" db connected with : " + response.host + ':' + response.port)
            application.listen(config.port)
            console.log(` Node Server started...\n Server Running on PORT : ${config.port} `)
        })
    } catch (error) { console.log(error.message) }
}
