const adminAuthRoutes = require("./admin/auth.js");
const userManagingRoutes = require("./admin/user");
const productManagingRoutes = require("./admin/product");
const categoryManageRoutes = require("./admin/category")
const userAuthRoutes = require("./user/auth.js");
const userManageRoutes = require("./admin/user");
const refreshToken = require("./common/refreshToken");
const uploadRoute = require("./common/upload");
const adminMange = require("./admin/admin");
const gold = require("./user/gold")
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
    return router;
}
module.exports = api;