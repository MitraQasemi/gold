const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth } = require("../../../middlewares");
const { getConfigInfo } = require("../../../../services/user/config");

const func = (app) => {
  app.use(route);

  route.get("/configInfo", isAuth, async (req, res, next) => {
    try {
      const result = await getConfigInfo();
      return res.send(result);
    } catch (error) {
      console.log(error);
      return next(new ApiError(error.statusCode, error.message));
    }
  });
};

module.exports = func;
