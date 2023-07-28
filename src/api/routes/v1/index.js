const adminAuthRoutes = require("./admin/auth");
const userManagingRoutes = require("./admin/user");
const productManagingRoutes = require("./admin/product");
const categoryManageRoutes = require("./admin/category")
const userAuthRoutes = require("./user/auth.js");
const userManageRoutes = require("./admin/user");
const refreshToken = require("./common/refreshToken");
const uploadRoute = require("./common/upload");
const adminMange = require("./admin/admin");
const gold = require("./user/gold");
const cart = require("./user/cart")
const product = require("./user/product")
const config = require("./admin/config");
const goldPrice = require("./admin/goldprice");
const goldChart = require("./admin/goldChart");
const user = require("./user/user")
const express = require("express");

const api = () => {

    const router = express.Router();
    adminAuthRoutes(router);
    userManagingRoutes(router);
    productManagingRoutes(router);
    categoryManageRoutes(router);
    userAuthRoutes(router);
    refreshToken(router);
    uploadRoute(router);
    userManageRoutes(router);
    adminMange(router);
    gold(router);
    cart(router);
    product(router);
    config(router);
    goldPrice(router);
    goldChart(router);
    user(router);
    return router;
}
module.exports = api;