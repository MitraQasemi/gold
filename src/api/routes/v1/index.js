const adminAuthRoutes = require("./admin/auth.js");
const userManagingRoutes = require("./admin/user");
const productManagingRoutes = require("./admin/product");
const categoryManageRoutes = require("./admin/category")
const userAuthRoutes = require("./user/auth.js");
const refreshToken = require("./common/refreshToken");
const userForgetPassword = require("./user/forgetPassword")
const uploadRoute = require("./common/upload")
const express = require("express");

const api = () => {

    const router = express.Router();
    adminAuthRoutes(router);
    userManagingRoutes(router);
    productManagingRoutes(router);
    categoryManageRoutes(router);
    userAuthRoutes(router);
    refreshToken(router);
    userForgetPassword(router);
    uploadRoute(router)

    return router;
}
module.exports = api;