const axios = require('axios');
const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require('@prisma/client');
require("dotenv").config({ path: "../.env" });

const prisma = new PrismaClient()


const computing = async (type, weight, price) => {
  try {   
        
  } catch (error) {
        throw new ApiError(500, error.message);
  }
}

module.exports = { computing};