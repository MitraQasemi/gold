const axios = require("axios");
const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config({ path: "../.env" });

const prisma = new PrismaClient();

const computing = async (type, weight, price) => {
  try {
    const currentPrice = await prisma.goldPrice.findFirst();
    if (type === "se-we" && weight) {
      const totalPrice = currentPrice.sellQuotation * weight;
      return totalPrice.toFixed(3);
    } else if (type === "bu-we" && weight) {
      const totalPrice = currentPrice.buyQuotation * weight;
      return totalPrice.toFixed(3);
    } else if (type === "se-pr" && price) {
      const totalWeight = price / currentPrice.sellQuotation;
      return totalWeight.toFixed(3);
    } else if (type === "bu-pr" && price) {
      const totalWeight = price / currentPrice.buyQuotation;
      return totalWeight.toFixed(3);
    } else {
      return "there is no valid parameters";
    }
  } catch (error) {
    throw new ApiError(400, "bad request");
  }
};

module.exports = { computing };
