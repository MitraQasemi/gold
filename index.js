const express = require("express");
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express();

app.get("/test", async (req, res) => {

})
app.listen(3000, () => {
    console.log("on port 3000");
})
