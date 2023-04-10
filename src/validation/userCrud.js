const joi = require('joi');


const create = {
    body: joi.object().keys({
        firstName: joi.string(),
        lastName: joi.string(),
        phoneNumber: joi.string().length(11).pattern(/^09\d{9}$/).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required(),
        blocked: joi.bool(),
        age: joi.number(),
        balance: joi.number(),
        countryCode: joi.number(),
        addresses: joi.array().items(joi.object({
            country: joi.string().required(),
            city: joi.string().required(),
            address: joi.string().required()
        }))
    })
}

const read = {
    params: joi.object().keys({
        id: joi.string().hex().length(24)
    }).required()
}

const readMany = {
    query: joi.object().keys({
        size: joi.string().pattern(new RegExp('^\\d+$')),
        page: joi.string().pattern(new RegExp('^^\\d+$'))
    })
}
const update = {
    params: joi.object().keys({
        id: joi.string().hex().length(24)
    }).required(),
    body: joi.object().keys({
        firstName: joi.string(),
        lastName: joi.string(),
        phoneNumber: joi.string().length(11).pattern(/^09\d{9}$/),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')),
        blocked: joi.bool(),
        age: joi.number(),
        balance: joi.number(),
        countryCode: joi.number(),
        addresses: joi.array().items(joi.object({
            country: joi.string().required(),
            city: joi.string().required(),
            address: joi.string().required()
        }))
    })
}

module.exports = {create, read, update, readMany}