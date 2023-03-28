const express = require("express");
const route = express.Router();
const {isAuth, isCan, attachCurrentAdmin, validate} = require("../../../middlewares")
const categoryCrudValidation = require("../../../../validation/categoryCrud");

const {getOneCategory, getManyCategories, createCategory, deleteCategory} = require("../../../../services/admin/categoryManage");

const func = (app) => {

    app.use(route);

    route.get("/admin/category/:id",validate(categoryCrudValidation.read), isAuth, attachCurrentAdmin, isCan("read", "Category"), async (req, res, next) => {
        try {
            const result = await getOneCategory(req.params.id)
            if (result)
            return res.send(result);
            throw new Error("not found")
        } catch (error) {
            next(error)
        }
    })

    route.get("/admin/category",validate(categoryCrudValidation.readMany), isAuth, attachCurrentAdmin, isCan("read", "Category"), async (req, res, next) => {
        try {
            const result = await getManyCategories(req.query)
            res.setHeader("count",result.count)
            return res.send(result.result)
        } catch (error) {
            return next(error);
        }
    })
    route.post("/admin/category",validate(categoryCrudValidation.create), isAuth, attachCurrentAdmin, isCan("create", "Category"), async (req, res, next) => {
        try {
            const result = await createCategory(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.delete("/admin/category/:id",validate(categoryCrudValidation.Delete), isAuth, attachCurrentAdmin, isCan("delete", "Category"), async (req, res, next) => {
        try {
            const result = await deleteCategory(req.params.id)
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;