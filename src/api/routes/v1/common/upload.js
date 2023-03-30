const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const uploader = require("../../../../services/common/uploader")

const func = (app) => {
  app.use(route);

  route.post("/admin/upload", (req, res, next) => {
    uploader(req, "products")
      .then((result) => {
        res.send(result[result.length - 1]);
      })
      .catch((error) => {
        next(new ApiError(500, error.message));
      })
  })

}

module.exports = func;