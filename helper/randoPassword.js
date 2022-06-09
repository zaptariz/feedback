const password_generator = require('generate-password')

exports.password = password_generator.generate({
    length: 10,
    numbers: true
})
