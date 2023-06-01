const loader = require("./loaders/index");

const express = require("express");

const app = express();

async function startServer() {
    await loader(app);
}

startServer();
