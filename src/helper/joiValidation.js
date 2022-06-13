const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

/***************************************************************************
*  Here, all the joi validation functions validate the body of the request
****************************************************************************/

exports.registerSchema = (req) => {
    let schema = Joi.object({
        userName: Joi.string().alphanum().min(3).max(30).required(),
        userEmail: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required(),
        role: Joi.number().max(1),
        adminrole: Joi.number().required()
    })
    return schema.validate(req, { abortEarly: false });
}

exports.login = (req) => {
    let schema = Joi.object({
        password: Joi.string().alphanum().min(8).required(),
        userEmail: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required(),
    })
    return schema.validate(req, { abortEarly: false });
}

exports.userFeedback = (req) => {
    let schema = Joi.object({
        to: Joi.objectId().required(),  // id is a objectId of userModel MongoDB id (from address)
        feedback: Joi.string().min(10).max(500).required()
    })
    return schema.validate(req, { abortEarly: false });
}
