const joi = require("joi");

const update = {
  body: joi.object().keys({
    firstName: joi.string(),
    lastName: joi.string(),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,16}$")),
    age: joi.number().integer(),
    countryCode: joi.string(),
    addresses: joi.array().items(
      joi.object({
        province: joi.string().required(),
        city: joi.string().required(),
        address: joi.string().required(),
        postalCode: joi.string().required(),
        plaque: joi.string().required(),
      })
    ),
    // TEMP
    walletBalance: joi.number().integer(),
  }),
};

module.exports = {
  update,
};
