const express = require("express");
const route = express.Router();
const lodash = require("lodash");
const { isAuth, isCan, attachCurrentAdmin, validate } = require("../../../middlewares");
const { ApiError } = require("../../../middlewares/error");
const adminCrudValidation = require("../../../../validation/adminCrud");
const { getAdmin, createAdmin, editAdmin, getManyAdmin } = require("../../../../services/admin/adminManage");

const func = (app) => {

    app.use(route);


    route.get("/admin/:id", validate(adminCrudValidation.read), isAuth, attachCurrentAdmin, isCan("read", "Admin"), async (req, res, next) => {
        try {
            const result = await getAdmin(req.params.id)
            const newResult = lodash.omit(result, ["password", "refreshToken"]);
            return res.send(newResult);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.get("/admin", validate(adminCrudValidation.readMany), isAuth, attachCurrentAdmin, isCan("read", "Admin"), async (req, res, next) => {
        try {
            const result = await getManyAdmin(req.query);
            res.setHeader("count", result.count);
            const newResult = result.result.map((item) => lodash.omit(item, ["password", "refreshToken"]))
            return res.send(newResult);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.post("/admin", validate(adminCrudValidation.create), isAuth, attachCurrentAdmin, isCan("create", "Admin"), async (req, res, next) => {
        try {
            const { username, password, permissions } = req.body;
            const result = await createAdmin(username, password, permissions)
            const newResult = lodash.omit(result, ["password", "refreshToken"]);
            return res.send(newResult);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.put("/admin/:id", validate(adminCrudValidation.update), isAuth, attachCurrentAdmin, isCan("update", "Admin"), async (req, res, next) => {
        try {
            const result = await editAdmin(req.params.id, req.body)
            const newResult = lodash.omit(result, ["password", "refreshToken"]);
            return res.send(newResult);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })
}

module.exports = func;