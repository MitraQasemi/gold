const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth } = require("../../../middlewares");
const { getGoldPrice } = require("../../../../services/user/goldPrice");

const func = (app) => {
  app.use(route);

  route.get("/goldPriceInfo", isAuth, async (req, res, next) => {
    try {
      const result = await getGoldPrice();
      return res.send(result);
    } catch (error) {
      console.log(error);
      return next(new ApiError(error.statusCode || 500, error.message));
    }
  });
};

module.exports = func;
