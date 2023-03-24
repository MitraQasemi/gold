const express = require("express");
const route = express.Router();
const { isAuth, isCan, attachCurrentAdmin } = require("../../../middlewares")

const { getProducts, createProducts, editProducts, deleteProducts } = require("../../../../services/admin/productManage")

const uploader = require("../../../../services/common/uploader")
const func = (app) => {

  app.use(route);

  route.get("/product", isAuth, attachCurrentAdmin, isCan("create", "Product"), async (req, res, next) => {
    try {
      const result = await getProducts(req.query)
      return res.send(result)
    } catch (error) {
      return next(error);
    }
  })
  route.post("/product", isAuth, attachCurrentAdmin, isCan("create", "Product"), async (req, res, next) => {
    try {
      // const result = await createProduct(req.body)
      // return res.send(result)
    } catch (error) {
      // return next(error);
    }
  })


  route.put("/product", isAuth, attachCurrentAdmin, isCan("update", "Product"), async (req, res, next) => {
    try {
      // const result = await editProduct(req.params.ProductId, req.body)
      // return res.send(result)
    } catch (error) {
      // return next(error);
    }
  })

  route.delete("/product/:productId", isAuth, attachCurrentAdmin, isCan("delete", "Product"), async (req, res, next) => {
    try {
      const result = await deleteProducts(req.params.productId)
      return res.send(result)
    } catch (error) {
      return next(error);
    }
  })

  route.post("/test", async (req, res, next) => {
    try {
      const result = await uploader(req, "products")
      res.send(result)
    } catch (error) {
      next(error)
    }
  })
}

module.exports = func;