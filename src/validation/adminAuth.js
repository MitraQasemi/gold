const joi = require('joi');


const login = {
    body : joi.object().keys({
        username: joi.string().min(5).max(10).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required()
    })
}

const signup = {
    body : joi.object().keys({
        username: joi.string().min(5).max(10).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required(),
        permissions: joi.array().items(joi.object({
            action: joi.string().valid(...["create", "read", "update", "delete"]).required(),
            subject: joi.string().valid(...["Admin", "User", "Product", "Category","Config","goldPrice"]).required()
        }))
    })
}
module.exports = {login, signup}