const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth } = require("../../../middlewares");
const { search } = require("../../../../services/user/search");

const func = (app) => {
  app.use(route);

  route.post("/search/:word", isAuth, async (req, res, next) => {
    try {
      const result = await search(req.params.word);
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode || 500, error.message));
    }
  });
};

module.exports = func;
