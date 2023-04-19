const joi = require("joi");

const computing = {
  body: joi.object().keys({
    type: joi.string().pattern(/^(buy|sell)-(weight|price)$/i).required(),
    value: joi.number().precision(3).strict().required(),
  }),
};

const buyGold = {
  body: joi.object().keys({
    type: joi.string().pattern(/^buy-(weight|price)$/i).required(),
    value: joi.number().precision(3).strict().required(),
  }),
};

const sellGold = {
  body: joi.object().keys({
    type: joi.string().pattern(/^sell-(weight|price)$/i).required(),
    value: joi.number().precision(3).strict().required(),
  }),
};

module.exports = { computing, buyGold, sellGold };
