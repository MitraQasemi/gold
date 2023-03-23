const joi = require("joi");
const {userSignupVerification} = require("../user/auth");

const validator = (schema) => (payload) => schema.validate(payload, {abortEarly: false})

const userSignupSchema = joi.object({
    phoneNumber: joi.string().length(10).pattern(/^[0-9]+$/).required()
})
const userSignupValidate = validator(userSignupSchema);

const userSignupVerificationSchema = joi.object({
    phoneNumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
    code: joi.string().length(5).pattern(/^[0-9]+$/).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required()
})
const userSignupVerificationValidate = validator(userSignupVerificationSchema)

const userLoginSchema = joi.object({
    phoneNumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required()
})
const userLoginValidate = validator(userLoginSchema)


module.exports = {userSignupValidate, userSignupVerificationValidate, userLoginValidate}