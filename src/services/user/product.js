const { ApiError } = require("../../api/middlewares/error");
const moment = require("jalali-moment");
const { PrismaClient } = require("@prisma/client");
const { date } = require("joi");
const { now } = require("moment");
const prisma = new PrismaClient();

const buyProduct = async (userId, productDetails) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: productDetails.productId,
    },
  });
  const variant = product.variants.find(
    (variant) => variant.variantId === productDetails.variantId
  );
  if (variant.quantity === 0) {
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

const priceCalculator = async (cart) => {
  const unitPrices = await prisma.goldPrice.findFirstOrThrow({
    orderBy: {
      date: "desc",
    },
  });
  const productIds = cart.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  let finalPrice = 0;

  products.forEach((product) => {
    const request = cart.find((i) => i.productId == product.id);
    const variant = product.variants.find(
      (i) => i.variantId == reqaest.variantId
    );
    const purePrice = variant.weight * unitPrices[product.weightUnit];
    finalPrice +=
      (purePrice +
        purePrice *
          (variant.wage + product.profitPercentage - variant.discount)) *
      request.count;
  });
  return finalPrice;
};
//محاسبات خرید قسطی
const computing = async (type, value, varient) => {
  const unitPrices = await prisma.goldPrice.findFirstOrThrow({
    orderBy: {
      date: "desc",
    },
  });

  if (type === "buy-weight") {
    const purePrice = value * unitPrices[varient.weightUnit];
    const finalPrice = purePrice + (varient.wage - varient.discount) * purePrice;
    return Math.round(finalPrice);
  } else if (type === "buy-price") {
    const totalWeight = value / (unitPrices[varient.weightUnit] + (varient.wage - varient.discount) * unitPrices[varient.weightUnit]);
    return Number(totalWeight.toFixed(3));
  } else {
    throw new ApiError(400, "bad request");
  }
};

//قسط اول
const firstInstallment = async (userId, productId, varientId, body) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId
    }
  })

  const varient = product.varients
    .find((varients) => { return varients.varientId === varientId })

  if (!varient || !varient.installment.available || varient.quantity === 0) {
    throw new ApiError(400, "امکان خرید قسطی این محصول وجود ندارد")
  }

  requestedWeight = body.type === "buy-weight"
    ? body.value
    : await computing(body.type, body.value, varient);

  if (requestedWeight < varient.installment.minWeight) {
    throw new ApiError(400, ` شما نمیتوانید برای قسط اول کمتر از ${product.installment.minWeight} گرم پرداخت کتید`)
  }

  const transactionResult = await prisma.$transaction(async (prisma) => {
    let price = body.type === "buy-price"
      ? body.value
      : await computing(body.type, body.value, varient);

    const config = await prisma.config.findFirstOrThrow();
    price += (config.commission);

    if (price < 100) {
      throw new ApiError(400, `شما نمیتوانید کمتر از ${100} پرداخت کنید`)
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId
      }
    })
    if (price > user.walletBalance) {
      throw new ApiError(400, `موجودی کافی نیست`)
    }
    //set deadline
    const deadLine = moment().add(varient.installment.deadLine, 'days');
    const createdOrder = await prisma.order.create({
      data: {
        date: moment().toISOString(),
        deadLine: deadLine.toISOString(),
        userId: userId,
        products: [
          {
            productId: productId,
            varientId: varientId,
            quantity: 1,
            installments: [{
              date: moment().toISOString(),
              weight: requestedWeight,
              price: price,
              wage: varient.wage
            }]
          }
        ],
        status: "pending",
        type: "installment",
        totalPrice: price,
        paidPrice: price
      }
    })

    //update varient
    const updatedArray = product.varients.map(obj => {
      if (obj.varientId === varientId) {
        return { ...obj, quantity: varient.quantity - 1, lockQuantity: varient.lockQuantity + 1 };
      }
      return obj;
    });

    await prisma.product.update({
      where: {
        id: productId

      },
      data: {
        varients: updatedArray
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
    return { createdOrder };
  });
  return transactionResult;
}
// خرید قسطی
const installmentPurchase = async (userId, productId, varientId, body) => {
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
      return await firstInstallment(userId, productId, varientId, body);
    }
    //چک کردن امکان خرید قسطی محصول و ادامه اقساط
    if (order[0].products[0].productId != productId) {
      throw new ApiError(400, `شما یک خرید قسطی تمام نشده دارید`)
    }
    //چک کردن ددلاین
    currentDate = new Date();
    if (currentDate > order[0].deadLine) {
      throw new ApiError(400, `شما دیگر قادر به پرداخت قسط  نیستید(موعد گذشته)`)
    }
    //ادامه اقساط
    const sumOfWeight = order[0].products[0].installments
      .reduce((accumulator, current) => accumulator + current.weight, 0);
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: productId
      }
    })
    const varient = product.varients
      .find((varients) => { return varients.varientId === varientId })

    requestedWeight = body.type === "buy-weight"
      ? body.value
      : await computing(body.type, body.value, varient);

    if (sumOfWeight + requestedWeight > varient.weight) {
      throw new ApiError(400, `مقدار وارد شده بیشتر از مانده قسط پرداخت نشده است`)
    }
    const transactionResult = await prisma.$transaction(async (prisma) => {
      let price = body.type === "buy-price"
        ? body.value
        : await computing(body.type, body.value, varient);

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

      if (price < 100) {
        throw new ApiError(400, `شما نمیتوانید کمتر از ${100} پرداخت کنید`)
      }
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          walletBalance: { decrement: price }
        }
      })
      if (sumOfWeight + requestedWeight === varient.weight) {
        //قسط اخر
        //خرید محصول نهایی میشود
        const updatedArray = product.varients.map(obj => {
          if (obj.varientId === varientId) {
            return { ...obj, lockQuantity: varient.lockQuantity - 1 };
          }
          return obj;
        });
        await prisma.product.update({
          where: {
            id: productId

          },
          data: {
            varients: updatedArray
          }
        })

        //اضافه کردن قسط
        order[0].products[0].installments.push({
          date: moment().toISOString(),
          weight: requestedWeight,
          price: price,
          wage: varient.wage
        })
        const updatedOrder = await prisma.order.update({
          where: {
            id: order[0].id
          },
          data: {
            products: order[0].products[0],
            status: "done"
          }
        })
        return { updatedOrder };
      }

      //اقساط عادی
      //اضافه کردن قسط
      order[0].products[0].installments.push({
        date: moment().toISOString(),
        weight: requestedWeight,
        price: price,
        wage: varient.wage
      })
      const updatedOrder = await prisma.order.update({
        where: {
          id: order[0].id
        },
        data: {
          products: order[0].products[0],
        }
      })
      return { updatedOrder };
    });
    return transactionResult;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};
module.exports = {
  buyProduct,
  priceCalculator,
  installmentPurchase,
};
