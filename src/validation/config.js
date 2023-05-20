const joi = require("joi");

const create = {
  body: joi.object().keys({
    goldPurchaseLimit: joi.array().items(joi.object({
      startAt: joi.string().required(),
      endAt: joi.string().required(),
      weightLimit: joi.number().required()
    })).required(),
    minPrice:joi.number().required(),
    commission:joi.number().required()
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
    })),
    minPrice:joi.number(),
    commission:joi.number()
  }),
};

module.exports = { create, update };
