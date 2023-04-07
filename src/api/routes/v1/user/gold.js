const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth, validate } = require("../../../middlewares");
const computingValidation = require("../../../../validation/gold")
const { computing } = require("../../../../services/user/gold")

const func = (app) => {
    app.use(route);
    route.post("/user/computing", isAuth, validate(computingValidation.computing), async (req, res, next) => {
        try {
            const { type, weight, price } = req.body;
            const result = await computing(type, weight, price);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    })

}

module.exports = func;