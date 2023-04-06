const joi = require('joi');


const computing = {
    body: joi.object().keys({
        type: joi.string().required(),
        weight: joi.decimal(),
        price: joi.number()
    })
}

module.exports = { computing }