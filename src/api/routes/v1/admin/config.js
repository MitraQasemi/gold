const express = require("express");
const route = express.Router();
const { isAuth, isCan, attachCurrentAdmin, validate } = require("../../../middlewares")
const configValidation = require("../../../../validation/config");
const { ApiError } = require("../../../middlewares/error");
const { createConfig, editConfig } = require("../../../../services/admin/config");

const func = (app) => {

    app.use(route);
    route.post("/config", validate(configValidation.create), isAuth, attachCurrentAdmin, isCan("create", "Config"), async (req, res, next) => {
        try {
            const result = await createConfig(req.body);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.put("/config/:id", validate(configValidation.update), isAuth, attachCurrentAdmin, isCan("update", "Config"), async (req, res, next) => {
        try {
            const result = await editConfig(req.params.id, req.body)
            return res.send(result)
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })
}

module.exports = func;