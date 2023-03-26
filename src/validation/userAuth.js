const joi = require('joi');


const signup = {
    body: joi.object().keys({
        phoneNumber: joi.string().length(11).pattern(/^[0-9]+$/).required()
    })
}

const signupVerification = {
    body: joi.object().keys({
        phoneNumber: joi.string().length(11).pattern(/^[0-9]+$/).required(),
        code: joi.string().length(5).pattern(/^[0-9]+$/).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required()
    })
}

const login = {
    body: joi.object().keys({
        phoneNumber: joi.string().length(11).pattern(/^[0-9]+$/).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required()
    })
}

const forgetPassword = {
    body: joi.object().keys({
        phoneNumber: joi.string().length(11).pattern(/^[0-9]+$/).required()
    })
}

const forgetPasswordVerification = {
    body: joi.object().keys({
        phoneNumber: joi.string().length(11).pattern(/^[0-9]+$/).required(),
        code: joi.string().length(5).pattern(/^[0-9]+$/).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required()
    })
}
module.exports = {signup, signupVerification, login, forgetPassword, forgetPasswordVerification}