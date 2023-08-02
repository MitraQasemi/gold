const joi = require("joi");

const productDetails = joi.object().keys({
  productId: joi.string().required(),
  variantId: joi.number().integer().required(),
  count: joi.number().integer().required(),
});

const productsList = {
  body: joi.array().items(productDetails),
};

const readMany = {
  query: joi.object().keys({
      size: joi.string().pattern(new RegExp('^\\d+$')).required(),
      page: joi.string().pattern(new RegExp('^^\\d+$')).required()
  })
}

const installmentPurchaseValidation = {
  params: joi.object().keys({
    productId: joi.string().hex().length(24),
    variantId: joi.number().integer()
  }).required(),
  body: joi.object().keys({
    type: joi.string().pattern(/^buy-(weight|price)$/i),
    value: joi.number(),
  })
}

module.exports = { productsList, installmentPurchaseValidation, readMany };
