const express = require("express");
const route = express.Router();
const { isAuth, isCan, attachCurrentAdmin, validate } = require("../../../middlewares")
const { ApiError } = require("../../../middlewares/error");
const { goldPrice } = require("../../../../services/admin/goldPrice");

const func = (app) => {

    app.use(route);
    route.post("/goldPrice", isAuth, attachCurrentAdmin, isCan("update", "goldPrice"), async (req, res, next) => {
        try {
            const result = await goldPrice();
            return res.send(result)
        } catch (error) {
            return next(new ApiError(error.statusCode||500, error.message));
        }
    })

}

module.exports = func;