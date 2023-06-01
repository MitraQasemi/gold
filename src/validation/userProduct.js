const Joi = require("joi");

const productDetails = Joi.object().keys({
  productId: Joi.string().required(),
  variantId: Joi.number().integer().required(),
  count: Joi.number().integer().required(),
});

const productsList = {
  body: Joi.array().items(productDetails),
};

module.exports = { productsList };

// let service = Joi.object().keys({
//   serviceName: Joi.string().required(),
// })

// let services = Joi.array().items(service)

// let test = Joi.validate(
//   [{ serviceName: 'service1' }, { serviceName: 'service2' }],
//   services,
// )
