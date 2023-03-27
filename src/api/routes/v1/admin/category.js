const express = require("express");
const route = express.Router();
const {isAuth, isCan, attachCurrentAdmin, validate} = require("../../../middlewares")
const categoryCrudValidation = require("../../../../validation/categoryCrud");

const {getOneCategory, getManyCategories, createCategory, deleteCategory} = require("../../../../services/admin/categoryManage");

const func = (app) => {

    app.use(route);

    route.get("/category/:id",validate(categoryCrudValidation.read), isAuth, attachCurrentAdmin, isCan("read", "Category"), async (req, res, next) => {
        try {
            const result = await getOneCategory(req.params.id)
            return res.send(result);
            ;
        } catch (error) {
            next(error)
        }
    })

    route.get("/category",validate(categoryCrudValidation.readMany), isAuth, attachCurrentAdmin, isCan("read", "Category"), async (req, res, next) => {
        try {
            const result = await getManyCategories(req.query)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
    route.post("/category",validate(categoryCrudValidation.create), isAuth, attachCurrentAdmin, isCan("create", "Category"), async (req, res, next) => {
        try {
            const result = await createCategory(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.delete("/category/:id",validate(categoryCrudValidation.Delete), isAuth, attachCurrentAdmin, isCan("delete", "Category"), async (req, res, next) => {
        try {
            const result = await deleteCategory(req.params.id)
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;