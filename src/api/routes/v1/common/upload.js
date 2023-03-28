const express = require("express");
const route = express.Router();

const uploader = require("../../../../services/common/uploader")

const func = (app) => {
  app.use(route);

  route.post("/admin/upload", (req, res, next) => {
    uploader(req, "products")
      .then((result) => {
        res.send(result[result.length - 1]);
      })
      .catch((err) => {
        next(err)
      })
  })

}

module.exports = func;