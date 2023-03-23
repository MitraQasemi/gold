const joi = require("joi");

const validator = (schema) => (payload) => schema.validate(payload, {abortEarly: false})

const adminSignupSchema = joi.object({
    username: joi.string().min(5).max(10).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required()
})

const adminAuthSchemaValidate = validator(adminSignupSchema);

module.exports = {adminAuthSchemaValidate}