const joi = require("joi");

const computing = {
  body: joi.object().keys({
    type: joi.string().required(),
    weight: joi.number(),
    price: joi.number(),
  }),
};

module.exports = { computing };
