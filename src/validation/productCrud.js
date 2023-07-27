const joi = require('joi');


const create = {
    body: joi.object().keys({
        title: joi.string().max(1000).required(),
        description: joi.string().max(1000).required(),
        category: joi.string(),
        tags: joi.array().items(joi.string()),
        wage: joi.number().less(1),
        profitPercentage: joi.number().less(1),
        weight: joi.number().precision(3),
        weightUnit: joi.string(),
        quantity: joi.number(),
        lockQuantity: joi.number(),
        discount: joi.number().less(1),
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
            variantId:joi.string(),
            variants: joi.array().items(joi.string()),
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
        category: joi.string(),
        tags: joi.array().items(joi.string()),
        wage: joi.number().less(1),
        profitPercentage: joi.number().less(1),
        weight: joi.number().precision(3),
        weightUnit: joi.string(),
        quantity: joi.number(),
        lockQuantity: joi.number(),
        discount: joi.number().less(1),
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
            variantId:joi.string(),
            variants: joi.array().items(joi.string()),
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

const Delete = {
    params: joi.object().keys({
        id: joi.string().hex().length(24)
    }).required()
}
module.exports = {create, read, update, Delete, readMany}