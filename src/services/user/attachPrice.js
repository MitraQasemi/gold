const { PrismaClient } = require("@prisma/client");
const { ApiError } = require("../../api/middlewares/error");

const prisma = new PrismaClient();

const attachPriceToCart = async (cart) => {
  try {
    const unitPrices = await getCurrentGoldPrice();
    const productIds = cart.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    const result = products.map((product) => {
      const reqProduct = cart.find((i) => i.productId == product.id);
      const reqVariant = product.variants.find(
        (i) => i.variantId == reqProduct.variantId
      );
      const purePrice = reqVariant.weight * unitPrices[reqVariant.weightUnit];
      const totalPrice = purePrice + purePrice * (reqVariant.wage + product.profitPercentage);
      const finalPrice = purePrice + purePrice * (reqVariant.wage + product.profitPercentage - reqVariant.discount);
      return {
        productId: product.id,
        variantId: reqVariant.variantId,
        title: product.title,
        image: product.thumbnailImage,
        totalPrice,
        finalPrice,
        count: reqProduct.count,
      };
    });

    return result;
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
};

const getCurrentGoldPrice = async () => {
  const result = await prisma.goldPrice.findFirstOrThrow({
    orderBy: {
      date: "desc",
    },
  });
  return result;
};

module.exports = {
  attachPriceToCart,
};
