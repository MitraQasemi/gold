const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth, validate } = require("../../../middlewares");
const { update } = require("../../../../validation/user");
const { getUser, editUser } = require("../../../../services/user/user");

const func = (app) => {
  app.use(route);

  route.get("/userInfo", isAuth, async (req, res, next) => {
    try {
      const result = await getUser(req.user.id);
      return res.send(result);
    } catch (error) {
      console.log(error);
      return next(new ApiError(error.statusCode, error.message));
    }
  });

  route.put("/userInfo", isAuth, validate(update), async (req, res, next) => {
    try {
      const result = await editUser(req.user.id, req.body);
      return res.send(result);
    } catch (error) {
      return next(new ApiError(error.statusCode, error.message));
    }
  });
};

module.exports = func;
