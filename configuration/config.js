require('dotenv').config()
exports.config = {
    port: process.env.PORT,
    dbConnection: process.env.CONNECTION_STRING,
    database: process.env.DB_NAME
}