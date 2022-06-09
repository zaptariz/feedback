const express = require('express')
const cors = require('cors')
require('dotenv').config()
const application = express()
application.use(express.json())
application.use(cors())
const router = require('./routes/index')
const dbConnection = require('./configuration/dbConfig')

//using cors
application.use(cors())
//json bodyparse
application.use(express.json())
// invoke the DB mongoose connection for mongoDB 
dbConnection.db();
console.log("hdfghh")
application.use('/api/v1', (req, res, next) => {
    
    next()
}, router);
