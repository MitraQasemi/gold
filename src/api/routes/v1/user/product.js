const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth, validate } = require("../../../middlewares");
const {
  productsList,
  installmentPurchaseValidation,
  readMany,
} = require("../../../../validation/userProduct");
const {
  search,
  buyProduct,
  installmentPurchase,
  priceCalculator,
  installmentPurchaseComputing,
} = require("../../../../services/user/product");

const func = (app) => {
  app.use(route);

  route.get( "/search/:word", validate(readMany), async (req, res, next) => {
      try {
        const { result, count } = await search(req.params.word, req.query);
        res.setHeader("count", count);
        res.setHeader("Access-Control-Expose-Headers", "count");
        return res.send(result);
      } catch (error) {
        return next(new ApiError(error.statusCode || 500, error.message));
      }
    }
  );

  route.post("/test-calc", async (req, res, next) => {
    try {
      const result = await priceCalculator(req.body);

      res.send({ result: result });
    } catch (error) {
      return next(new ApiError(error.statusCode || 500, error.message));
    }
  });

  route.post( "/buyProduct", isAuth, validate(productsList), async (req, res, next) => {
      try {
        const result = await buyProduct(req.user.id, req.body);
        return res.send(result);
      } catch (error) {
        return next(new ApiError(error.statusCode || 500, error.message));
      }
    }
  );

  route.post( "/installmentPurchase/:productId/:variantId", isAuth, validate(installmentPurchaseValidation), async (req, res, next) => {
      try {
        const result = await installmentPurchase(
          req.user.id,
          req.params.productId,
          req.params.variantId,
          req.body
        );
        return res.send(result);
      } catch (error) {
        return next(new ApiError(error.statusCode || 500, error.message));
      }
    }
  );

  route.post( "/installmentPurchaseComputing/:productId/:variantId", isAuth, async (req, res, next) => {
      try {
        const result = await installmentPurchaseComputing(
          req.params.productId,
          req.params.variantId,
          req.body
        );
        return res.send(result);
      } catch (error) {
        return next(new ApiError(error.statusCode || 500, error.message));
      }
    }
  );
};

module.exports = func;
