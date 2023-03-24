const adminAuthRoutes = require("./admin/auth.js");
const userAuthRoutes = require("./user/auth.js");
const userManageRoutes = require("./admin/user");
const refreshToken = require("./common/refreshToken");
const adminMange = require("./admin/admin");
const express = require("express");

const api = () => {

    const router = express.Router();
    adminAuthRoutes(router);
    userAuthRoutes(router);
    refreshToken(router);
    userManageRoutes(router);
    adminMange(router);

    return router;
}
module.exports = api;