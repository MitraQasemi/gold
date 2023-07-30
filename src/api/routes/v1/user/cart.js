const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth, validate } = require("../../../middlewares");
const { addAndRemove } = require("../../../../validation/cart");
const {
  addToCart,
  removeFromCart,
  getCart,
} = require("../../../../services/user/cart");

const func = (app) => {
  app.use(route);

  route.put("/addToCart", isAuth, validate(addAndRemove), async (req, res, next) => {
    try {
      const result = await addToCart(req.user.id, req.body);
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode || 500, error.message));
    }
  });

  route.put("/removeFromCart", isAuth, validate(addAndRemove), async (req, res, next) => {
    try {
      const result = await removeFromCart(req.user.id, req.body);
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode || 500, error.message));
    }
  });

  route.get("/cart", isAuth, async (req, res, next) => {
    try {
      const result = await getCart(req.user.id);
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode || 500, error.message));
    }
  });
};

module.exports = func;
