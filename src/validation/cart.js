const joi = require("joi");

const addAndRemove = {
  body: joi.object().keys({
    count: joi.number().integer().required(),
    productId: joi.string().hex().length(24).required(),
    variantId: joi.number().integer().required(),
  }),
};

module.exports = { addAndRemove };
