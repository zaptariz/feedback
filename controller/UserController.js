//required Models
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usermodel = require('../model/userModel');
const { usertoken } = require('../model/JwtToken');
const format = require('../middleware/fileFormatHelper')
const password_generator = require('generate-password');
const sendOTPVerification = require('./otpSender')
const { number } = require('joi');

/*********************************
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 * 
 * @returns {function}
 *********************************/
const file_format = format.fileformat

exports.signup = async (req, res) => {
    try {
        console.log(" req.body : ", req.body.userEmail)
        //Check the user is exists
        if (await usermodel.findOne({ userName: req.body.userName })) {
            throw new Error(" userName is not available try with diffrent new userName")
        }
        else {
            let password = password_generator.generate({
                length: 10,
                numbers: true
            })
            console.log('password :', password)
            let email_check = await usermodel.findOne({ userEmail: req.body.userEmail })
            if (!email_check) {
                // Encrypt the password
                password = await bcrypt.hash(password, 10)
                // console.log(" my n ")
                const request = req.body
                let payload = new usermodel({
                    userName: req.body.userName,
                    userEmail: req.body.userEmail,
                    role: req.body.role,
                    profilePhoto: {
                        fileName: req.file.originalname,
                        fileType: req.file.mimetype,
                        fileSize: file_format(req.file.size, 2)
                    }
                })
                //insert to DB
                const response = await new usermodel(payload).save()
                await usermodel.findOneAndUpdate({ userEmail: req.body.email, password: password })
                    .then((result) => {
                        sendOTPVerification(result)
                        return res.status(200).json({ "id": result._id })
                    }).catch(err => {
                        console.log("error  : ", err);
                    })
                return res.status(200).json({
                    status: " SUCCESS",
                    success_response: "your account created successfully ",
                    user_name: response.userName,
                    mailId: response.userEmail,
                    password: "your password is send to your registered mailId."
                })
            } else res.status(400).send({
                status: " FAILURE ",
                error_response: "Email already registered"
            })
        }
    } catch (error) {
        res.status(401).json({ "error_mesage ": error.message })
    }
}
/********************************
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {function}
 ********************************/

exports.signin = async (req, res) => {
    try {
        let email_check = await usermodel.findOne({ userEmail: req.body.userEmail })
        if (email_check) {
            let email_password = email_check.password
            //this password from request
            let pas_from_user = req.body.password
            // this password from DB
            let pas_fromm_db = email_password
            //Decrypt the password and save to psswd_vald for validation purpose
            let psswd_vald = await bcrypt.compare(pas_from_user, pas_fromm_db);
            if (psswd_vald) {
                let payload = {
                    id: email_check._id,
                    email: email_check.userEmail
                }
                let token = jwt.sign(payload, "secret")
                // console.log('payload : ',payload, token)
                let tokenPayload = {
                    user: email_check._id,
                    token: token
                }
                //save the tokan in usertoken
                await new usertoken(tokenPayload).save()
                res.status(200).json({
                    status: " SUCCESS",
                    success_response: `Logged in succesfully with ${email_check.userEmail}`,
                    tokenPayload
                })
            }
            else
                return res.status(401).json('credential not matched')
        }
        else
            return res.status(401).json('Email Id not found signup with your mail')
    }
    catch (error) {
        return res.status(404).send({
            error_response: error.message
        })
    }
}