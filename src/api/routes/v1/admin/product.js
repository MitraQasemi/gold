const express = require("express");
const path = require('path');

const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth, isCan, attachCurrentAdmin, validate } = require("../../../middlewares")
const productCrudValidation = require("../../../../validation/productCrud");
const { getOneProduct, getManyProducts, createProduct, editProduct, deleteProduct, filter } = require("../../../../services/admin/productManage");

const func = (app) => {

    app.use(route);

    route.get("/product/:id", validate(productCrudValidation.read), async (req, res, next) => {
        try {
            const result = await getOneProduct(req.params.id)
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }

    })

    route.get("/product", validate(productCrudValidation.readMany), async (req, res, next) => {
        try {
            const result = await getManyProducts(req.query)
            res.setHeader("count", result.count)
            return res.send(result.result)
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })
    route.post("/product", isAuth, attachCurrentAdmin, isCan("create", "Product"), async (req, res, next) => {
        try {
            const result = await createProduct(req.body);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })


    route.put("/product/:id", validate(productCrudValidation.update), isAuth, attachCurrentAdmin, isCan("update", "Product"), async (req, res, next) => {
        try {
            const result = await editProduct(req.params.id, req.body)
            return res.send(result)
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.delete("/product/:id", validate(productCrudValidation.Delete), isAuth, attachCurrentAdmin, isCan("delete", "Product"), async (req, res, next) => {
        try {
            const result = await deleteProduct(req.params.id)
            return res.send(result)
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    //filter
    route.get("/filter", async (req, res, next) => {
        try {
            const result = await filter(req.query)
            res.setHeader("count", result.count)
            res.setHeader('Access-Control-Expose-Headers', 'count');
            return res.send(result.result)
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })


}

module.exports = func;