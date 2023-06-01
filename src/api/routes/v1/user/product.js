const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth, validate } = require("../../../middlewares");
const { productsList } = require("../../../../validation/userProduct");
const {
  buyProduct,
  installmentPurchase,
  priceCalculator,
} = require("../../../../services/user/product");

const func = (app) => {
  app.use(route);

  route.post("/test-calc", async (req, res, next) => {
    try {
      const result = await priceCalculator(req.body);
      res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode, error.message));
    }
  });

  route.post("/buyProduct", isAuth, validate(productsList), async (req, res, next) => {
    try {
      const result = await buyProduct(req.user.id, req.body)
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode, error.message));
    }
  });

  route.post("/installmentPurchase/:productId/:variantId", isAuth, async (req, res, next) => {
    try {
      const result = await installmentPurchase(req.user.id, req.params.productId, req.params.variantId, req.body);
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode, error.message));
    }
  });
};

module.exports = func;
