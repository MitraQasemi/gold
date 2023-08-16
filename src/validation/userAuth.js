const joi = require('joi');


const signup = {
    body: joi.object().keys({
        phoneNumber: joi.string().length(11).pattern(/^09\d{9}$/).required()
    })
}

const signupVerification = {
    body: joi.object().keys({
        phoneNumber: joi.string().length(11).pattern(/^09\d{9}$/).required(),
        code: joi.string().length(5).pattern(/^[0-9]+$/).required(),
        password: joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/).required()
    })
}

const login = {
    body: joi.object().keys({
        phoneNumber: joi.string().length(11).pattern(/^09\d{9}$/).required(),
        password: joi.string().required()
    })
}

const forgetPassword = {
    body: joi.object().keys({
        phoneNumber: joi.string().length(11).pattern(/^09\d{9}$/).required()
    })
}

const forgetPasswordVerification = {
    body: joi.object().keys({
        phoneNumber: joi.string().length(11).pattern(/^09\d{9}$/).required(),
        code: joi.string().length(5).pattern(/^[0-9]+$/).required(),
        password: joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/).required()
    })
}
module.exports = {signup, signupVerification, login, forgetPassword, forgetPasswordVerification}