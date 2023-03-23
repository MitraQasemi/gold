const joi = require("joi");
const validator = (schema) => (payload) => schema.validate(payload, {abortEarly: false})

const idSchema = joi.object({
    id: joi.string().hex().length(24)
})

const idValidate = validator(idSchema);

module.exports = {idValidate}