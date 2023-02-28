const expressLoader = require("./express");

const loader = async (app) => {
    await expressLoader(app);
    console.log("express loaded");
}

module.exports = loader;