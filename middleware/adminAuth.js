
const jwt = require('jsonwebtoken');
const usermodel  = require('../model/userModel');
const { usertoken } = require('../model/JwtToken')
const { model } = require('../model/userModel')


/*********************************
 * JsonWebToken For adminAuthenticaton.
 *
 * @param {string}      headers
 * @param {object}      id
 * @param {string}      userEmail
 * 
 * @returns {function}
 * 
 * 
 * note  : Jwt for feature works
 *********************************/
const adminAuth = async (req, res, next) => {
    try {
        let header = req.headers.authorization
        let verify_token = await jwt.verify(header, "secret")
        let check_token = await usertoken.findOne({ token: header, user: verify_token.id })
        if (!check_token && check_token.is_deleted) {
            throw new Error(" Token not found ")
        }
        else {
            let find_mail = await usermodel.findOne({ email: verify_token.userEmail })
            if (find_mail) {
                if (find_mail.role == 1) {
                    req.user = find_mail
                    next()
                }
                else throw new Error("Authentication failed, User is not a developer. Your request could not be authenticated.")
            }
            else throw new Error("email id not found")
        }
    }
    catch (error) {
        return res.status(401).json({"error_response  ": error.message});
    }
};

module.exports = adminAuth