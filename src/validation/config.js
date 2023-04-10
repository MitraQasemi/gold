const joi = require("joi");

const create = {
  body: joi.object().keys({
    goldPurchaseLimit: joi.array().items(joi.object({
      startAt: joi.string().required(),
      endAt: joi.string().required(),
      weightLimit: joi.number().required()
    })).required()
  }),
};

const update = {
  params: joi.object().keys({
    id: joi.string().hex().length(24)
  }).required(),
  
  body: joi.object().keys({
    goldPurchaseLimit: joi.array().items(joi.object({
      startAt: joi.string(),
      endAt: joi.string(),
      weightLimit: joi.number()
    }))
  }),
};

module.exports = { create, update };
