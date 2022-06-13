//required Models
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usermodel = require('../model/userModel');
const { usertoken } = require('../model/JwtToken');
const format = require('../middleware/fileFormat')
const password_generator = require('../helper/randoPassword');
const messageFormat = require('../utils/messageFormat')
const { StatusCodes } = require('http-status-codes')
// const transporter = require('../helper/nodeMailer')

require('dotenv').config()
// const joi = require('joi');

/*********************************
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 * @param {number}      role ( user role)
 * @param {number}      adminRole 
 * @returns {function}
 *********************************/
const file_format = format.fileformat

exports.signup = async (req, res) => {
    try {
        let request = req.body
        //Check the user is exists
        if (await usermodel.findOne({ userName: request.userName })) {
            throw new Error(" userName is not available try with diffrent new userName")
        }
        else {
            //for save in the random password 
            let password = password_generator.password
            // for show to user
            let temp_password = password_generator.password
            let email_check = await usermodel.findOne({ userEmail: request.userEmail })
            if (!email_check) {
                // Encrypt the password
                password = await bcrypt.hash(password, 10)
                let payload = new usermodel({
                    password,
                    userName: request.userName,
                    userEmail: request.userEmail,
                    role: request.role,
                    profilePhoto: {
                        fileName: req.file.originalname,
                        fileType: req.file.mimetype,
                        fileSize: file_format(req.file.size, 2)
                    }
                })
                //insert to DB
                let response = await new usermodel(payload).save()
                await usermodel.findOneAndUpdate({ userEmail: payload.userEmail, password: password })
                // .then((request) => {
                //     const mailoption = {
                //         from: process.env.SENDER,
                //         to: request.userEmail,
                //         subject: "verify your mail",
                //         html: `this is your password is : ${password}, your OTP will expires within 15minits`
                //     }
                //     // Send mail stuff
                //     transporter.sendMail(mailoption, (err, data) => {
                //         if (err) {
                //             return res.status(401).json('Opps error occured')
                //         } else {
                //             return res.status(200).json(data)
                //         }
                //     })
                //     return res.status(200).json({ "id": request._id })
                // }).catch((err) => {
                // })
                let rawData = {
                    status: " SUCCESS",
                    success_response: "your account created successfully ",
                    user_name: response.userName,
                    mailId: response.userEmail
                }
                return res.status(StatusCodes.OK).send(messageFormat.successFormat(
                    rawData,
                    'signup',
                    StatusCodes.OK,
                    `your password is : ${temp_password} is send to your registered mailId .`
                ))
            } else return res.status(StatusCodes.BAD_REQUEST).send(messageFormat.errorMsgFormat(
                " Given EmailId was registered already",
                'signup',
                StatusCodes.BAD_REQUEST,

            ))
        }
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormat.errorMsgFormat(
            error.message,
            'register',
            StatusCodes.BAD_REQUEST))
    }
}
/********************************
 * User login.
 *
 * @param   {string}      email
 * @param   {string}      password
 * @header  {string}      jwtToken
 * 
 * @returns {function}
 ********************************/

exports.login = async (req, res) => {
    try {
        let request = req.body
        let adminRole = request.adminrole
        let email_check = await usermodel.findOne({ userEmail: request.userEmail })
        if (email_check) {
            // let email_password = 
            //this password from request
            let pas_from_user = request.password
            // this password from DB
            let pas_fromm_db = email_check.password
            //Decrypt the password and save to psswd_vald for validation purpose
            let psswd_vald = await bcrypt.compare(pas_from_user, pas_fromm_db);
            if (psswd_vald) {
                let payload = {
                    id: email_check._id,
                    email: email_check.userEmail
                }
                let token = jwt.sign(payload, "secret")
                let tokenPayload = {
                    user: email_check._id,
                    token: token
                }
                //save the tokan in usertoken
                await new usertoken(tokenPayload).save()
                res.status(StatusCodes.OK).send(messageFormat.successFormat(tokenPayload, 'login', StatusCodes.OK, `Logged in succesfully with ${email_check.userEmail}`))
            }
            else
                return res.status(StatusCodes.UNAUTHORIZED).send(messageFormat.errorMsgFormat('credential not matched', 'login', StatusCodes.UNAUTHORIZED))
        }
        else
            return res.status(StatusCodes.NOT_FOUND).send(messageFormat.errorMsgFormat('Email Id not found signup with your mail', 'login', StatusCodes.NOT_FOUND))
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormat.errorMsgFormat(error.message, 'login', StatusCodes.BAD_REQUEST))
    }
}

/********************************
 * User logout
 *
 * @param   {string}      email
 * @param   {string}      password
 * @header  {string}      jwtToken
 * 
 * @returns {function}
 ********************************/

exports.logout = async (req, res) => {
    try {
        //Delete the  Jwt token for log out
        let response = await usertoken.deleteMany({ token: req.headers.authorization })
        res.status(StatusCodes.OK).send(messageFormat.successFormat(response, 'logout', StatusCodes.OK, " logged out successfully "))
    }
    catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(messageFormat.errorMsgFormat(error.message, 'login', StatusCodes.BAD_REQUEST))
    }
}