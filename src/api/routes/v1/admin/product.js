const express = require("express");
const route = express.Router();
const { isAuth, isCan, attachCurrentAdmin } = require("../../../middlewares")

const { getOneProduct, getManyProducts, createProduct, editProduct, deleteProduct } = require("../../../../services/admin/productManage");

const func = (app) => {

  app.use(route);

  route.get("/product/:productId", isAuth, attachCurrentAdmin, isCan("read", "Product"), async (req, res, next) => {
    try {
      const result = await getOneProduct(req.params.productId)
      return res.send(result);
    } catch (error) {
      next(error)
    }
  })

  route.get("/product", isAuth, attachCurrentAdmin, isCan("read", "Product"), async (req, res, next) => {
    try {
      const result = await getManyProducts(req.query)
      return res.send(result)
    } catch (error) {
      return next(error);
    }
  })
  route.post("/product", isAuth, attachCurrentAdmin, isCan("create", "Product"), async (req, res, next) => {
    try {
      const result = await createProduct(req.body);
      return res.send(result);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  })


  route.put("/product/:productId", isAuth, attachCurrentAdmin, isCan("update", "Product"), async (req, res, next) => {
    try {
      const result = await editProduct(req.params.productId, req.body)
      return res.send(result)
    } catch (error) {
      return next(error);
    }
  })

  route.delete("/product/:productId", isAuth, attachCurrentAdmin, isCan("delete", "Product"), async (req, res, next) => {
    try {
      const result = await deleteProduct(req.params.productId)
      return res.send(result)
    } catch (error) {
      return next(error);
    }
  })

}

module.exports = func;