const attachCurrentAdmin = require("./attachCurrentAdmin");
const isAuth = require("./isAuth");
const isCan = require("./isCan");
const validate = require("./validate");

module.exports = {isAuth, isCan, validate, attachCurrentAdmin}