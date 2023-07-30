const express = require("express");
const route = express.Router();
const { isAuth, isCan, attachCurrentAdmin, validate } = require("../../../middlewares")
const categoryCrudValidation = require("../../../../validation/categoryCrud");
const { ApiError } = require("../../../middlewares/error");
const { getOneCategory, getManyCategories, createCategory, deleteCategory } = require("../../../../services/admin/categoryManage");

const func = (app) => {

    app.use(route);

    route.get("/category/:id", validate(categoryCrudValidation.read), isAuth, attachCurrentAdmin, isCan("read", "Category"), async (req, res, next) => {
        try {
            const result = await getOneCategory(req.params.id)
            if (result)
                return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.get("/category", validate(categoryCrudValidation.readMany), isAuth, attachCurrentAdmin, isCan("read", "Category"), async (req, res, next) => {
        try {
            const result = await getManyCategories(req.query)
            res.setHeader("count", result.count)
            return res.send(result.result)
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })
    route.post("/category", validate(categoryCrudValidation.create), isAuth, attachCurrentAdmin, isCan("create", "Category"), async (req, res, next) => {
        try {
            const result = await createCategory(req.body);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.delete("/category/:id", validate(categoryCrudValidation.Delete), isAuth, attachCurrentAdmin, isCan("delete", "Category"), async (req, res, next) => {
        try {
            const result = await deleteCategory(req.params.id)
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })
}

module.exports = func;