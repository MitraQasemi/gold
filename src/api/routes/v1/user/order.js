const express = require("express");
const route = express.Router();
const lodash = require("lodash");
const { isAuth, validate } = require("../../../middlewares");
const { ApiError } = require("../../../middlewares/error");
const adminCrudValidation = require("../../../../validation/adminCrud");
const { readOne, readMany } = require("../../../../validation/order");
const {
  getOneOrder,
  getAllOrders,
  getOrders
  // canselOrder,
} = require("../../../../services/user/order");

const func = (app) => {
  app.use(route);

  route.get("/order/:orderId", isAuth, validate(readOne), async (req, res, next) => {
    try {
      const result = await getOneOrder(req.params.orderId);
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode || 500, error.message));
    }
  });

  route.get("/orders", isAuth, validate(readMany), async (req, res, next) => {
    try {
      const result = await getAllOrders(req.user.id, req.query);
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode || 500, error.message));
    }
  });

  route.get("/getOrders", isAuth, validate(readMany), async (req, res, next) => {
    try {
      const result = await getOrders(req.query);
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode || 500, error.message));
    }
  });
  // route.put("/order/:orderId", isAuth, async (req, res, next) => {
  //   try {
  //   } catch (error) {
  //     return next(new ApiError(error.statusCode || 500, error.message));
  //   }
  // });
};

module.exports = func;
