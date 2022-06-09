//required Models
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usermodel = require('../model/userModel');
const { usertoken } = require('../model/JwtToken');
const format = require('../middleware/fileFormatHelper')
const password_generator = require('generate-password');
const joiValidation = require('../helper/joiValidation')
const messageFormat = require('../utils/messageFormat')
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
 * 
 * @returns {function}
 *********************************/
const file_format = format.fileformat

exports.signup = async (req, res) => {
    try {
        // joi validation
        const request = await joiValidation.registerSchema.validateAsync(req.body)

        //Check the user is exists
        if (await usermodel.findOne({ userName: request.userName })) {
            throw new Error(" userName is not available try with diffrent new userName")
        }
        else {
            //lets generate the random password 
            let password = password_generator.generate({
                length: 10,
                numbers: true
            })
            let temp_password = password
            let email_check = await usermodel.findOne({ userEmail: request.userEmail })
            if (!email_check) {
                // Encrypt the password
                password = await bcrypt.hash(password, 10)
                // console.log(" my n ")
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
                // console.log(" payloda")
                //insert to DB
                const response = await new usermodel(payload).save()
                // console.log("  request.userEmail ", request.userEmail)
                await usermodel.findOneAndUpdate({ userEmail: payload.userEmail, password: password })
                // .then((request) => {
                //     console.log(" request : ", request)
                //     const mailoption = {
                //         from: process.env.SENDER,
                //         to: request.userEmail,
                //         subject: "verify your mail",
                //         html: `this is your password is : ${password}, your OTP will expires within 15minits`
                //     }
                //     // Send mail stuff
                //     transporter.sendMail(mailoption, (err, data) => {
                //         if (err) {
                //             console.log(err)
                //             return res.status(401).json('Opps error occured')
                //         } else {
                //             return res.status(200).json(data)
                //         }
                //     })
                //     return res.status(200).json({ "id": request._id })
                // }).catch((err) => {
                //     console.log("error  : ", err);
                // })
                return res.status(200).json({
                    status: " SUCCESS",
                    success_response: "your account created successfully ",
                    user_name: response.userName,
                    mailId: response.userEmail,
                    password: `your password is : ${temp_password} is send to your registered mailId .`
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

exports.login = async (req, res) => {
    try {
        let request = req.body
        console.log(" array : ", request)
        let email_check = await usermodel.findOne({ userEmail: request.userEmail })
        console.log(email_check)
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
                // console.log('payload : ',payload, token)
                let tokenPayload = {
                    user: email_check._id,
                    token: token
                }
                //save the tokan in usertoken
                await new usertoken(tokenPayload).save()
                res.status(200).json(messageFormat.successFormat(tokenPayload, 'login', 200, `Logged in succesfully with ${email_check.userEmail}`))
            }
            else
                return res.status(401).json('credential not matched')
        }
        else
            return res.status(401).json('Email Id not found signup with your mail')
    }
    catch (error) {
        return res.status(400).send(messageFormat.errorMsgFormat(error.message, 'login', 400))
    }
}

exports.logout = async (req, res) => {
    try {
        let response = await usertoken.deleteMany({ token: req.headers.authorization })
        res.status(200).send({ response: " logged out successfully" })
    }
    catch (error) {
        return res.status(404).send({
            error_response: error.message
        })
    }
}

exports.update = async (req, res) => {
    try {
        const request = await joiValidation.updateUserDetails.validateAsync(req.body)
        if (request.profilePhoto) {
            let response = await usermodel.findOneAndUpdate({ profilePhoto: request.profilePhoto, profilePhoto })
            console.log(" request update  : ", response)
        }
        // else (request.profilePhoto){
        //     let response = await usermodel.findOneAndUpdate({ profilePhoto: request.profilePhoto, profilePhoto })
        //     console.log(" request update  : ", response)
        // }
    }
    catch (error) {
        return res.status(404).send({
            error_response: error.message
        })
    }
}



/*router.use('/user', userRoute);
router.use('/nft', nftRoute);
router.use('/collection', collectionRoute);
router.use('/project', projectRoute);
router.use('/transaction'*/ 