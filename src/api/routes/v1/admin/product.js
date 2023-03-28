const express = require("express");
const route = express.Router();
const {isAuth, isCan, attachCurrentAdmin, validate} = require("../../../middlewares")
const productCrudValidation = require("../../../../validation/productCrud");
const {getOneProduct, getManyProducts, createProduct, editProduct, deleteProduct} = require("../../../../services/admin/productManage");

const func = (app) => {

    app.use(route);

    route.get("/admin/product/:id",validate(productCrudValidation.read), isAuth, attachCurrentAdmin, isCan("read", "Product"), async (req, res, next) => {
        try {
            const result = await getOneProduct(req.params.id)
            return res.send(result);
        } catch (error) {
            return next(error)
        }

    })

    route.get("/admin/product",validate(productCrudValidation.readMany), isAuth, attachCurrentAdmin, isCan("read", "Product"), async (req, res, next) => {
        try {
            const result = await getManyProducts(req.query)
            res.setHeader("count",result.count)
            return res.send(result.result)
        } catch (error) {
            return next(error);
        }
    })
    route.post("/admin/product",validate(productCrudValidation.create), isAuth, attachCurrentAdmin, isCan("create", "Product"), async (req, res, next) => {
        try {
            const result = await createProduct(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })


    route.put("/admin/product/:id",validate(productCrudValidation.update), isAuth, attachCurrentAdmin, isCan("update", "Product"), async (req, res, next) => {
        try {
            const result = await editProduct(req.params.id, req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })

    route.delete("/admin/product/:id",validate(productCrudValidation.Delete), isAuth, attachCurrentAdmin, isCan("delete", "Product"), async (req, res, next) => {
        try {
            const result = await deleteProduct(req.params.id)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })

}

module.exports = func;