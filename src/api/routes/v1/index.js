const adminAuthRoutes = require("./admin/auth");
const userManagingRoutes = require("./admin/user");
const productManagingRoutes = require("./admin/product");
const categoryManageRoutes = require("./admin/category")
const userAuthRoutes = require("./user/auth.js");
const userManageRoutes = require("./admin/user");
const refreshToken = require("./common/refreshToken");
const uploadRoute = require("./common/upload");
const adminMange = require("./admin/admin");
const gold = require("./user/gold")
const config = require("./admin/config")
const goldPrice = require("./admin/goldprice")
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
    config(router);
    goldPrice(router);
    return router;
}
module.exports = api;