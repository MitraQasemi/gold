const joi = require('joi');


const create = {
    body: joi.object().keys({
        username: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,16}$')).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')).required(),
        permissions: joi.array().items(joi.object({
            action: joi.string().valid(...["create", "read", "update", "delete"]).required(),
            subject: joi.string().valid(...["Admin", "User", "Product", "Category", "Config", "goldPrice"]).required()
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
        page: joi.string().pattern(new RegExp('^\\d+$'))
    })
}

const update = {
    params: joi.object().keys({
        id: joi.string().hex().length(24)
    }).required(),
    body: joi.object().keys({
        username: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,16}$')),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,16}$')),
        permissions: joi.array().items(joi.object({
            action: joi.string().valid(...["create", "read", "update", "delete"]).required(),
            subject: joi.string().valid(...["Admin", "User", "Product", "Category", "Config", "goldPrice"]).required()
        }))
    })
}

module.exports = { create, read, update, readMany }