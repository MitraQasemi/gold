const joi = require("joi");

const validator = (schema) => (payload) => schema.validate(payload, {abortEarly: false})

const createAdminSchema = joi.object({
    username: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required(),
    permissions: joi.array().items(joi.object({
        action: joi.string().valid(...["create", "read", "update"]).required(),
        subject: joi.string().valid(...["Admin", "User"]).required()
    }))
})


const createAdminValidate = validator(createAdminSchema);

const updateAdminSchema = joi.object({
    username: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')),
    permissions: joi.array().items(joi.object({
        action: joi.string().valid(...["create", "read", "update"]).required(),
        subject: joi.string().valid(...["Admin", "User"]).required()
    }))
})


const updateAdminValidate = validator(updateAdminSchema);
module.exports = {createAdminValidate, updateAdminValidate}