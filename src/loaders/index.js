const expressLoader = require("./express");
const jobsLoader = require("./goldPriceJob");

const loader = async (app) => {
    await expressLoader(app);
    console.log("express loaded");
    jobsLoader();
    console.log("jobs loaded");
}

module.exports = loader;