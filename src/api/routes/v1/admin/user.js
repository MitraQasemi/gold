const express = require("express");
const route = express.Router();
const lodash = require("lodash");
const { ApiError } = require("../../../middlewares/error");
const { isAuth, isCan, attachCurrentAdmin, validate } = require("../../../middlewares");
const userCrudValidation = require("../../../../validation/userCrud");
const { getUser, createUser, editUser, getManyUser } = require("../../../../services/admin/userManage");

const func = (app) => {
    app.use(route);
    route.get("/admin/user/:id", validate(userCrudValidation.read), isAuth, attachCurrentAdmin, isCan("read", "User"), async (req, res, next) => {
        try {
            const result = await getUser(req.params.id)
            const newResult = lodash.omit(result, ["password", "refreshToken"]);
            return res.send(newResult);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.get("/admin/user", validate(userCrudValidation.readMany), isAuth, attachCurrentAdmin, isCan("read", "User"), async (req, res, next) => {
        try {
            const result = await getManyUser(req.query)
            res.setHeader("count", result.count)
            const newResult = result.result.map((item) => lodash.omit(item, ["password", "refreshToken"]))
            return res.send(newResult);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.post("/admin/user", validate(userCrudValidation.create), isAuth, attachCurrentAdmin, isCan("create", "User"), async (req, res, next) => {
        try {
            const result = await createUser(req.body)
            const newResult = lodash.omit(result, ["password", "refreshToken"]);
            return res.send(newResult);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })


    route.put("/admin/user/:id", validate(userCrudValidation.update), isAuth, attachCurrentAdmin, isCan("update", "User"), async (req, res, next) => {
        try {
            const result = await editUser(req.params.id, req.body)
            const newResult = lodash.omit(result, ["password", "refreshToken"]);
            return res.send(newResult);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })
}

module.exports = func;