const joi = require("joi");

const readOne = {
  params: joi.object().keys({orderId: joi.string().hex().length(24),}).required(),
};

const readMany = {
  query: joi.object().keys({
    size: joi.string().pattern(new RegExp("^\\d+$")).required(),
    page: joi.string().pattern(new RegExp("^^\\d+$")).required(),
  }),
};

module.exports = { readOne, readMany };
