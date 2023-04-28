const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const buyGold = async (userId, productId) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
    },
  });

};

const priceCalculator = async (product) => {
  const unitPrices = await prisma.goldPrice.findFirstOrThrow({
    orderBy: {
      date: "desc",
    },
  });
  const purePrice = product.weight * unitPrices[product.weightUnit];
  const finalPrice = purePrice + (product.wage - product.discount) * purePrice;
  return finalPrice;
};

module.exports = {
  buyGold,
  priceCalculator,
};
