const joi = require('joi');


const create = {
    body: joi.object().keys({
        title: joi.string().max(1000),
        description: joi.string().max(1000),
        wage: joi.number(),
        weight: joi.number(),
        weightUnit: joi.number(),
        quantity: joi.number(),
        lockQuantity: joi.number(),
        discount: joi.number(),
        metaData: joi.array().items(joi.object({
            property: joi.string(),
            value: joi.string()
        })),
        installment: joi.object({
            available: joi.boolean(),
            minWeight: joi.number(),
            deadLine: joi.number()
        }),
        varients: joi.array().items(joi.object({
            varients: joi.array().items(joi.string()),
            wage: joi.number(),
            weight: joi.number(),
            quantity: joi.number(),
            lockQuantity: joi.number(),
            discount: joi.number(),
            installment: joi.object({
                available: joi.boolean(),
                minWeight: joi.number(),
                deadLine: joi.number()
            })
        }))
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
        title: joi.string().max(1000),
        description: joi.string().max(1000),
        wage: joi.number(),
        weight: joi.number(),
        weightUnit: joi.number(),
        quantity: joi.number(),
        lockQuantity: joi.number(),
        discount: joi.number(),
        metaData: joi.array().items(joi.object({
            property: joi.string(),
            value: joi.string()
        })),
        installment: joi.object({
            available: joi.boolean(),
            minWeight: joi.number(),
            deadLine: joi.number()
        }),
        varients: joi.array().items(joi.object({
            varients: joi.array().items(joi.string()),
            wage: joi.number(),
            weight: joi.number(),
            quantity: joi.number(),
            lockQuantity: joi.number(),
            discount: joi.number(),
            installment: joi.object({
                available: joi.boolean(),
                minWeight: joi.number(),
                deadLine: joi.number()
            })
        }))
    })
}

const Delete = {
    params: joi.object().keys({
        id: joi.string().hex().length(24)
    })
}
module.exports = {create, read, update, Delete}