const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth, validate } = require("../../../middlewares");
const goldValidation = require("../../../../validation/gold");
const {
  buyProduct,
  installmentPurchase,
  priceCalculator,
} = require("../../../../services/user/product");

const func = (app) => {
  app.use(route);

  route.post("/test-calc", async (req, res, next) => {
    try {
      const result = await priceCalculator(cart);
      res.send({ result });
    } catch (error) {
      return next(new ApiError(error.statusCode, error.message));
    }
  });

  route.post("/buyProduct", isAuth, async (req, res, next) => {
    try {
      const { id, count } = req.body;
      const result = await buyGold(req.user.id, id);
      return result;
    } catch (error) {
      return next(new ApiError(error.statusCode, error.message));
    }
  });

  route.post("/installmentPurchase/:id", isAuth, async (req, res, next) => {
    try {

      const result = await installmentPurchase(req.user.id, req.params.id, req.body);
      return result;
    } catch (error) {
      return next(new ApiError(error.statusCode, error.message));
    }
  });
};

module.exports = func;
