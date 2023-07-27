const express = require("express");
const route = express.Router();
// const { isAuth, isCan, attachCurrentAdmin, validate } = require("../../../middlewares")
const { ApiError } = require("../../../middlewares/error");
const { goldChart } = require("../../../../services/admin/goldChart");

const func = (app) => {

    app.use(route);
    route.get("/goldChart", async (req, res, next) => {
        try {
            const result = await goldChart();
            return res.send(result);
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    })

}

module.exports = func;