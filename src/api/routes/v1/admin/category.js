const express = require("express");
const route = express.Router();
const { isAuth, isCan, attachCurrentAdmin } = require("../../../middlewares")

const { getOneCategory, getManyCategories, createCategory, deleteCategory } = require("../../../../services/admin/categoryManage");

const func = (app) => {

  app.use(route);

  route.get("/category/:categoryId", async (req, res, next) => {
    try {
      const result = await getOneCategory(req.params.categoryId)
      return res.send(result);;
    } catch (error) {
      next(error)
    }
  })

  route.get("/category", async (req, res, next) => {
    try {
      const result = await getManyCategories(req.query)
      return res.send(result)
    } catch (error) {
      return next(error);
    }
  })
  route.post("/category", async (req, res, next) => {
    try {
      const result = await createCategory(req.body);
      return res.send(result);
    } catch (error) {
      return next(error);
    }
  })

  route.delete("/category/:categoryId", async (req, res, next) => {
    try {
      const result = await deleteCategory(req.params.categoryId)
      return res.send(result);
    } catch (error) {
      return next(error);
    }
  })

}

module.exports = func;