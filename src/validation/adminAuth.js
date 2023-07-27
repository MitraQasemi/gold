const joi = require('joi');


const login = {
    body : joi.object().keys({
        username: joi.string().pattern(/^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).required(),
        password: joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required()
    })
}

const signup = {
    body : joi.object().keys({
        username: joi.string().pattern(/^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).required(),
        password: joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
        permissions: joi.array().items(joi.object({
            action: joi.string().valid(...["create", "read", "update", "delete"]).required(),
            subject: joi.string().valid(...["Admin", "User", "Product", "Category","Config","goldPrice"]).required()
        }))
    })
}
module.exports = {login, signup}