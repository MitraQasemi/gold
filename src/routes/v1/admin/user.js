const express = require("express");
const { createMongoAbility, ForbiddenError, subject } = require("@casl/ability")

const interpolate = require("../../../helpers/interpolate")

const route = express.Router();
const permissions = ["create"]

const func = (app) => {
  app.use(route);
  route.post("/userManage", async (req, res, next) => {
    try {
      const ability = createMongoAbility(interpolate(permissions, "User"));

      const userDetails = req.body

      ForbiddenError.from(ability).throwUnlessCan('create', subject('User', userDetails));

      console.log("user created");

    } catch (error) {
      return next(error);
    }
  })
}

module.exports = func;