const adminAuthRoutes = require("./admin/auth.js");
const userAuthRoutes = require("./user/auth.js");

const express = require("express");

const api = () => {

    const router = express.Router();
    adminAuthRoutes(router);
    userAuthRoutes(router);
    return router;
}
module.exports = api;