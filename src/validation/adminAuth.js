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
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required()
    })
}
module.exports = {login, signup}