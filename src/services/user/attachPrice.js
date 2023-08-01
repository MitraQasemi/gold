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

    let totalPriceOfCart = 0;
    let finalPriceOfCart = 0;

    const result = products.map((product) => {
      const reqProduct = cart.find((i) => i.productId == product.id);
      const reqVariant = product.variants.find(
        (i) => i.variantId == reqProduct.variantId
      );
      const purePrice = reqVariant.weight * unitPrices[reqVariant.weightUnit];
      const totalPrice = purePrice + purePrice * (reqVariant.wage + product.profitPercentage);
      totalPriceOfCart += totalPrice;
      const finalPrice = purePrice + purePrice * (reqVariant.wage + product.profitPercentage - reqVariant.discount);
      finalPriceOfCart += finalPrice;
      return {
        productId: product.id,
        variantId: reqVariant.variantId,
        title: product.title,
        image: product.thumbnailImage,
        totalPrice: Math.round(totalPrice),
        finalPrice: Math.round(finalPrice),
        count: reqProduct.count,
      };
    });
    const postPrice = 25000;
    return {
      products: result,
      totalPriceOfCart: Math.round(totalPriceOfCart),
      discountPrice: Math.round(totalPriceOfCart - finalPriceOfCart),
      postPrice,
      paymentPrice: Math.round(finalPriceOfCart + postPrice),
    };
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
};

const attachPriceToProduct = async (products) => {
  try {
    const unitPrices = await getCurrentGoldPrice();

    const result = products.map((product) => {
      const purePrice = product.weight * unitPrices[product.weightUnit];
      const totalPrice = purePrice + purePrice * (product.wage + product.profitPercentage);
      const finalPrice = purePrice + purePrice * (product.wage + product.profitPercentage - product.discount);

      product.totalPrice = Math.round(totalPrice);
      product.finalPrice = Math.round(finalPrice);

      return product;
    });

    return result;
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
};

const attachPriceToVariant = async (product) => {
  const unitPrices = await getCurrentGoldPrice();

  const purePrice = product.weight * unitPrices[product.weightUnit];
  const totalPrice = purePrice + purePrice * (product.wage + product.profitPercentage);
  const finalPrice = purePrice + purePrice * (product.wage + product.profitPercentage - product.discount);

  product.totalPrice = Math.round(totalPrice);
  product.finalPrice = Math.round(finalPrice);
    
  product.variants.forEach((variant) => {
    const purePrice = variant.weight * unitPrices[variant.weightUnit];
    const totalPrice = purePrice + purePrice * (variant.wage + product.profitPercentage);
    const finalPrice = purePrice + purePrice * (reqVariant.wage + product.profitPercentage - reqVariant.discount);
    variant.totalPrice = Math.round(totalPrice);
    variant.finalPrice = Math.round(finalPrice);
  });

  return product;
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
  attachPriceToProduct,
  attachPriceToVariant,
};
