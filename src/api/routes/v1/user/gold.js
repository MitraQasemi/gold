const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth, validate } = require("../../../middlewares");
const goldValidation = require("../../../../validation/gold");
const {
  computing,
  buyGold,
  sellGold,
  getGoldTransactions
} = require("../../../../services/user/gold");

const func = (app) => {
  app.use(route);
  route.post("/user/computing", isAuth, validate(goldValidation.computing), async (req, res, next) => {
    try {
      const { type, value } = req.body;
      const result = await computing(type, value);
      return res.send({ result });
    } catch (error) {
      return next(new ApiError(error.statusCode || 500, error.message));
    }
  }
  );

  route.post("/user/buyGold", isAuth, validate(goldValidation.buyGold), async (req, res, next) => {
    try {
      const result = await buyGold(req.user.id, req.body);
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode || 500, error.message));
    }
  }
  );

  route.post("/user/sellGold", isAuth, validate(goldValidation.sellGold), async (req, res, next) => {
    try {
      const result = await sellGold(req.user.id, req.body);
      return res.send(result);
    } catch (error) {
      console.log(error);
      return next(new ApiError(error.statusCode || 500, error.message));
    }
  }
  );

  route.get("/userGoldTransactions", isAuth, validate(goldValidation.readMany), async (req, res, next) => {
    try {
      const result = await getGoldTransactions(req.user.id, req.query);
      res.setHeader("count", result.count)
      res.setHeader('Access-Control-Expose-Headers', 'count');
      return res.send(result.transactions);
    } catch (error) {
      console.log(error);
      return next(new ApiError(error.statusCode, error.message));
    }
  });
};

module.exports = func;
