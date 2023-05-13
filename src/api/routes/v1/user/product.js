const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth, validate } = require("../../../middlewares");
const goldValidation = require("../../../../validation/gold");
const { buyGold, installmentPurchase } = require("../../../../services/user/product");

const func = (app) => {
  app.use(route);

  route.post("/buyProduct", isAuth, async (req, res, next) => {
    try {
      const { id, count } = req.body;
      const result = await buyGold(req.user.id, id,);
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode, error.message));
    }
  });

  route.post("/installmentPurchase/:productId/:varientId", isAuth, async (req, res, next) => {
    try {
      const result = await installmentPurchase(req.user.id, req.params.productId, req.params.varientId, req.body);
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode, error.message));
    }
  })
};

module.exports = func;
