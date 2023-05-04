const { ApiError } = require("../../api/middlewares/error");
const moment = require("jalali-moment");
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
    const order = await prisma.order.findMany({
      where: {
        userId: userId,
        status: "pending",
        type: "installment"
      }
    })
    if (order.length === 0) {
      //قسط اول
      const product = await prisma.product.findUniqueOrThrow({
        where: {
          id: productId
        }
      })
      if (!product.installment.available || product.quantity === 0) {
        throw new ApiError(400, "امکان خرید قسطی این محصول وجود ندارد")
      }
      requestedWeight = body.type === "buy-weight"
        ? body.value
        : await computing(body.type, body.value, product);

      if (requestedWeight < product.installment.minWeight) {
        throw new ApiError(400, ` شما نمیتوانید برای قسط اول کمتر از ${product.installment.minWeight} گرم پرداخت کتید`)
      }
      const transactionResult = await prisma.$transaction(async (prisma) => {
        let price = body.type === "buy-price"
          ? body.value
          : await computing(body.type, body.value, product);

        const config = await prisma.config.findFirstOrThrow();
        price += (config.commission);
        const user = await prisma.user.findUniqueOrThrow({
          where: {
            id: userId
          }
        })

        if (price > user.walletBalance) {
          throw new ApiError(400, `موجودی کافی نیست`)
        }
        const createdOrder = await prisma.order.create({
          data: {
            date: moment().toISOString(),
            userId: userId,
            products: [
              {
                productId: productId,
                quantity: 1,
                installments: [{
                  date: moment().toISOString(),
                  weight: requestedWeight,
                  price: price,
                  wage: product.wage
                }]
              }
            ],
            status: "pending",
            type: "installment",
            totalPrice: price,
            paidPrice: price
          }
        })

        await prisma.product.update({
          where: {
            id: productId
          },
          data: {
            quantity: { decrement: 1 },
            lockQuantity: { increment: 1 }
          }
        })

        await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            walletBalance: { decrement: price }
          }
        })
        return createdOrder
      });

      return transactionResult;
    }

    //چک کردن امکان خرید قسطی محصول و ادامه اقساط
    if (order.products[0].productId != productId) {
      throw new ApiError(400, `شما یک خرید قسطی تمام نشده دارید`)
    }

    
  } catch (error) {
    throw new ApiError(500, error.message);
  }

};
module.exports = {
  buyProduct,
  priceCalculator,
  installmentPurchase
};
