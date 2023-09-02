const express = require("express");
const route = express.Router();
const { isAuth, isCan, attachCurrentAdmin } = require("../../../middlewares");
const { ApiError } = require("../../../middlewares/error");
const { getBuyAndSaleReports } = require("../../../../services/admin/gold");

const func = (app) => {
  app.use(route);

  route.get("/gold-reports", isAuth, attachCurrentAdmin, isCan("read", "goldTransaction"), async (req, res, next) => {
      try {
        const result = await getBuyAndSaleReports();
        return res.send(result);
      } catch (error) {
        return next(new ApiError(error.statusCode || 500, error.message));
      }
    }
  );
};

module.exports = func;
