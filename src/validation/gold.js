const joi = require("joi");

const computing = {
  body: joi.object().keys({
    type: joi.string().required(),
    value: joi.number(),
  }),
};

module.exports = { computing };
