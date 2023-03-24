const joi = require('joi');


const create = {
    body: joi.object().keys({
        firstName: joi.string(),
        lastName: joi.string(),
        phoneNumber: joi.string().length(11).pattern(/^[0-9]+$/).required(),
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
}

const read = {
    params: joi.object().keys({
        id: joi.string().hex().length(24)
    })
}

const update = {
    params: joi.object().keys({
        id: joi.string().hex().length(24)
    }),
    body: joi.object().keys({
        firstName: joi.string(),
        lastName: joi.string(),
        phoneNumber: joi.string().length(11).pattern(/^[0-9]+$/),
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
}

module.exports = {create, read, update}