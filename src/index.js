const loader = require("./loaders/index");
const { seeder } = require("./loaders/seeder");
const express = require("express");

const app = express();

async function startServer() {
  await loader(app);
  await seeder();
}

startServer();
