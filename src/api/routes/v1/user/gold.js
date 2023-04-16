const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth, validate } = require("../../../middlewares");
const goldValidation = require("../../../../validation/gold");
const {
  computing,
  buyGold,
  sellGold,
} = require("../../../../services/user/gold");

const func = (app) => {
  app.use(route);
  route.post( "/user/computing", isAuth, validate(goldValidation.computing), async (req, res, next) => {
      try {
        const { type, value } = req.body;
        const result = await computing(type, value);
        return res.send(result);
      } catch (error) {
        return next(new ApiError(500, error.message));
      }
    }
  );

  route.post( "/user/buyGold", isAuth, validate(goldValidation.buyGold), async (req, res, next) => {
      try {
        const result = await buyGold(req.user.id, req.body);
        return res.send(result);
      } catch (error) {
        console.log(error);
        return next(new ApiError(error.statusCode, error.message));
      }
    }
  );

  route.post( "/user/sellGold", isAuth, validate(goldValidation.sellGold), async (req, res, next) => {
      try {
        const result = await sellGold(req.user.id, req.body)
        return res.send(result);
      } catch (error) {
        console.log(error);
        return next(new ApiError(error.statusCode, error.message));
      }
    }
  );
};

module.exports = func;
