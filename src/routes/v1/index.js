const adminAuthRoutes = require("./admin/auth.js");
const userManageRoutes = require("./admin/user");
const userAuthRoutes = require("./user/auth.js");
const userForgetPassword = require("./user/forgetPassword")
const express = require("express");

const api = () => {

    const router = express.Router();
    adminAuthRoutes(router);
    userManageRoutes(router);
    userAuthRoutes(router);
    userForgetPassword(router);
    return router;
}
module.exports = api;