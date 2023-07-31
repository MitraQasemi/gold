const loader = require("./loaders/index");
const { productSeeder, goldChartSeeder } = require("./loaders/seeder");
const express = require("express");

const app = express();

async function startServer() {
  await loader(app);
  await productSeeder();
  await goldChartSeeder();
}

startServer();
