const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const buyProduct = async (userId, productId) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
    },
  });
  if (product.quantity === 0) {
    throw new ApiError(400, "this product was sold out");
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const productPrice = await priceCalculator(product);

  if (user.walletBalance < productPrice) {
    throw new ApiError(400, "not enugh cash in wallet");
  }
  const transactionResult = await prisma.$transaction(async (prisma) => {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        walletBalance: {
          decrement: productPrice,
        },
      },
    });
    
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
  buyProduct,
  priceCalculator,
};
