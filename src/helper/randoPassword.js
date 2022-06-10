
const password_generator = require('generate-password')

/*************************************
*  Random password generator
***************************************/
exports.password = password_generator.generate({
    length: 10,
    numbers: true
})
