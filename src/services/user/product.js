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

const computing = async (type, value, product) => {
  const unitPrices = await prisma.goldPrice.findFirstOrThrow({
    orderBy: {
      date: "desc",
    },
  });

  if (type === "buy-weight") {
    const purePrice = value * unitPrices[product.weightUnit];
    const finalPrice = purePrice + (product.wage - product.discount) * purePrice;
    return Math.round(finalPrice);
  } else if (type === "buy-price") {
    const totalWeight = value / (unitPrices[product.weightUnit] + (product.wage - product.discount) * unitPrices[product.weightUnit]);
    return Number(totalWeight.toFixed(3));
  } else {
    throw new ApiError(400, "bad request");
  }
};

const installmentPurchase = async (userId, productId, body) => {
  try {
    const product = await prisma.Product.findUniqueOrThrow({
      where: {
        id: productId
      }
    })
    //موحود است یا نه
    if (product.quantity === 0) {
      throw new ApiError(403, "unavailable");
    }    
    // قسطی است یا نه
    if (!product.installment.available) {
      throw new ApiError(403, "this product does not have installment purchase");
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId
      }
    })

    // if (body.type === "buy-weight") {
    //   if (value > product.installment.minWeight) {
    //     throw new ApiError(403, "this product does not have installment purchase");
    //   }
    // }


  } catch (error) {
    throw new ApiError(500, error.message);
  }

};
module.exports = {
  buyProduct,
  priceCalculator,
  installmentPurchase
};
