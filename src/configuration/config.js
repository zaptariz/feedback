require('dotenv').config()

//internal configuration for db and NodeServer
exports.config = {
    port: process.env.PORT,
    dbConnection: process.env.CONNECTION_STRING,
    database: process.env.DB_NAME
}