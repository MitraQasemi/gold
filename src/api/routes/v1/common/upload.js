const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const uploader = require("../../../../services/common/uploader")

const func = (app) => {
  app.use(route);

  route.post("/upload", (req, res, next) => {
    uploader(req, "products")
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        next(new ApiError(error.statusCode || 500, error.message));
      })
  })

}

module.exports = func;