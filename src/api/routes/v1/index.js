const adminAuthRoutes = require("./admin/auth.js");
const userAuthRoutes = require("./user/auth.js");
const refreshToken = require("./common/refreshToken");
const userForgetPassword = require("./user/forgetPassword")
const express = require("express");

const api = () => {

    const router = express.Router();
    adminAuthRoutes(router);
    userAuthRoutes(router);
    refreshToken(router);
    userForgetPassword(router);

    return router;
}
module.exports = api;