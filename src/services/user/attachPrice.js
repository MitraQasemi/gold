const { PrismaClient } = require("@prisma/client");
const { ApiError } = require("../../api/middlewares/error");

const prisma = new PrismaClient();

const calculatePrice = (product, variant, unitPrices) => {
  const purePrice = variant.weight * unitPrices[variant.weightUnit];
  const totalPrice =
    purePrice + purePrice * (variant.wage + product.profitPercentage);
  const finalPrice =
    purePrice +
    purePrice * (variant.wage + product.profitPercentage - variant.discount);
  return {
    totalPrice: Math.round(totalPrice),
    finalPrice: Math.round(finalPrice),
  };
};

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
      const { totalPrice, finalPrice } = calculatePrice(
        product,
        reqVariant,
        unitPrices
      );
      totalPriceOfCart += totalPrice;
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
      const { finalPrice, totalPrice } = calculatePrice(
        product,
        product,
        unitPrices
      );

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
  try {
    const unitPrices = await getCurrentGoldPrice();

    const { totalPrice, finalPrice } = calculatePrice(
      product,
      product,
      unitPrices
    );

    product.totalPrice = Math.round(totalPrice);
    product.finalPrice = Math.round(finalPrice);

    product.variants.forEach((variant) => {
      const { totalPrice, finalPrice } = calculatePrice(
        product,
        variant,
        unitPrices
      );
      variant.totalPrice = Math.round(totalPrice);
      variant.finalPrice = Math.round(finalPrice);
    });

    return product;
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
  calculatePrice,
  attachPriceToCart,
  attachPriceToProduct,
  attachPriceToVariant,
  getCurrentGoldPrice,
};
