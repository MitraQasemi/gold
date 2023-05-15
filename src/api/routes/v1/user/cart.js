const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth, validate } = require("../../../middlewares");
const { addToCart } = require("../../../../services/user/cart");

const func = (app) => {
  app.use(route);

  route.post("/testCart", isAuth, async (req, res, next) => {
    try {
      const result = await addToCart(req.user.id, req.body);
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode, error.message));
    }
  });

  route.put("/addToCart", async (req, res, next) => {
    try {
      const result = 0;
      return result;
    } catch (error) {
      return next(new ApiError(error.statusCode, error.message));
    }
  });

  route.put("/removeFromCart", async (req, res, next) => {
    try {
      const result = 0;
      return result;
    } catch (error) {
      return next(new ApiError(error.statusCode, error.message));
    }
  });
};

module.exports = func;
