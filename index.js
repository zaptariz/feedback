const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()


const application = express()
application.use(express.json())
application.use(cors())
const router = express.Router()
const userapi = require('./routes/userApi')
const PORT = process.env.PORT
const db = () => {
    try {
        mongoose.connect('mongodb://localhost/feedback', (error, response) => {
            console.log(" db connected with : http://" + response.host + ':' + response.port)
        })
    } catch (error) { console.log(error.message) }
}
db();

const nodeserver = () => {
    try {
        application.listen(PORT, (err, data) => {
            console.log(` Node Server started...\n Server Running on PORT : ${PORT} `)
        })
    } catch (error) {
        console.log(error.message)
    }
}
nodeserver()

application.use('/user',userapi)