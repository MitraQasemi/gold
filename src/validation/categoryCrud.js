const joi = require('joi');


const create = {
    body: joi.object().keys({
        name: joi.string().required(),
        category: joi.string().required(),
        parent: joi.string().required(),
        slug: joi.string().required()
    })
}

const readMany = {
    query: joi.object().keys({
        size: joi.string().pattern(new RegExp('^\\d+$')),
        page: joi.string().pattern(new RegExp('^\\d+$'))
    })
}

const read = {
    params: joi.object().keys({
        id: joi.string().hex().length(24)
    })
}

const Delete = {
    params: joi.object().keys({
        id: joi.string().hex().length(24)
    })
}

module.exports = {create, readMany, read, Delete}