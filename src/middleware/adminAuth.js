
const jwt = require('jsonwebtoken');
const userModel  = require('../model/userModel');
const { usertoken } = require('../model/JwtToken')


/*********************************
 * JsonWebToken For adminAuthenticaton.
 *
 * @param {string}      headers
 * @param {object}      id
 * @param {string}      userEmail
 * 
 * @returns {function}
 * 
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
            let findEmailId = await userModel.findOne({ email: verify_token.userEmail })
            if (findEmailId) {
                if (findEmailId.role == 1) {
                    req.user = findEmailId
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