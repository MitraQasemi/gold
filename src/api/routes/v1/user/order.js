const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth } = require("../../../middlewares");
const { getOneOrder } = require("../../../../services/user/orders");

const func = (app) => {
    app.use(route);

    route.get("/getOneOrder/:orderId", isAuth, async (req, res, next) => {
        try {
            const result = await getOneOrder(req.user.id, req.params.orderId);
            return res.send(result);
        } catch (error) {
            console.log(error);
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    });
};

module.exports = func;
