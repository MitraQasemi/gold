const joi = require("joi");
const validator = (schema) => (payload) => schema.validate(payload, {abortEarly: false})

const createUserSchema = joi.object({
    firstName: joi.string(),
    lastName: joi.string(),
    phoneNumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required(),
    blocked: joi.bool(),
    age: joi.number(),
    balance: joi.number(),
    countryCode: joi.number(),
    addresses: joi.object({
        country: joi.string().required(),
        city: joi.string().required(),
        address: joi.string().required()
    })
})


const createUserValidate = validator(createUserSchema);

const updateUserSchema = joi.object({
    firstName: joi.string(),
    lastName: joi.string(),
    phoneNumber: joi.string().length(10).pattern(/^[0-9]+$/),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')),
    blocked: joi.bool(),
    age: joi.number(),
    balance: joi.number(),
    countryCode: joi.number(),
    addresses: joi.object({
        country: joi.string().required(),
        city: joi.string().required(),
        address: joi.string().required()
    })
})


const updateUserValidate = validator(updateUserSchema);

module.exports = {createUserValidate, updateUserValidate}