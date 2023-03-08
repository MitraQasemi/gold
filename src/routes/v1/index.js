const adminAuthRoutes = require("./admin/auth.js");
const userAuthRoutes = require("./user/auth.js");
const userForgetPassword = require("./user/forgetPassword");
const userManageRoutes = require("./admin/user")
const express = require("express");

const api = () => {

    const router = express.Router();
    adminAuthRoutes(router);
    userAuthRoutes(router);
    userForgetPassword(router);
    userManageRoutes(router);
    return router;
}
module.exports = api;