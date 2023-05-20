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
            varientId:joi.string(),
            varients: joi.array().items(joi.string()),
            weightUnit:joi.string(),
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
        variants: joi.array().items(joi.object({
            variants: joi.array().items(joi.string()),
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
    }).required()
}
module.exports = {create, read, update, Delete, readMany}