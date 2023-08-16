const { ApiError } = require("../../api/middlewares/error");
const moment = require("jalali-moment");
const { PrismaClient } = require("@prisma/client");
const { date } = require("joi");
const { now } = require("moment");
const { notification } = require("../../jobs/notification");
const { unlockAt } = require("./../../jobs/unlockingProduct");
const {
  attachPriceToProduct,
  calculatePrice,
  getCurrentGoldPrice,
} = require("./attachPrice");
const prisma = new PrismaClient();

const search = async (word, queryObject) => {
  try {
    const query = {
      where: {
        OR: [
          {
            title: {
              contains: word,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: word,
              mode: "insensitive",
            },
          },
          {
            tags: {
              has: word,
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        thumbnailImage: true,
        profitPercentage: true,
        weightUnit: true,
        discount: true,
        weight: true,
        wage: true,
      },
      skip: Number(queryObject.size * (queryObject.page - 1)) | 0,
      take: Number(queryObject.size),
    };
    let result = await prisma.product.findMany(query);
    result = await attachPriceToProduct(result);
    const { where } = query;
    const count = await prisma.product.count({ where });
    return { result, count };
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
};

const buyProduct = async (userId, cart) => {
  try {
    //check address
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        cart: true,
      },
    });

    if (user.addresses.length === 0) {
      throw new ApiError(400, "!اطلاعات آدرس وارد نشده است");
    }

    const productIds = cart.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length === 0) {
      throw new ApiError(400, "bad request");
    }
    const unitPrices = await getCurrentGoldPrice();
    const variantsShortage = [];
    const orderedProductsList = [];
    cart.forEach((request) => {
      const reqProduct = products.find((i) => i.id === request.productId);
      const variant = reqProduct.variants.find(
        (i) => i.variantId === request.variantId
      );
      const { totalPrice, finalPrice } = calculatePrice(
        reqProduct,
        variant,
        unitPrices
      );
      orderedProductsList.push({
        productId: reqProduct.id,
        variantId: variant.variantId,
        totalPurchasePrice: totalPrice,
        finalPurchasePrice: finalPrice,
        count: request.count,
      });

      if (variant.quantity < request.count || variant.quantity === 0) {
        variantsShortage.push(reqProduct.title);
      }
    });

    if (variantsShortage.length !== 0) {
      throw new ApiError(
        400,
        `مقدار کافی از این محصول وجود ندارد ${variantsShortage.join(", ")}`
      );
    }

    // const user = await prisma.user.findUniqueOrThrow({
    //   where: {
    //     id: userId,
    //   },
    // });

    const productsPrice = await priceCalculator(cart);
    if (user.walletBalance < productsPrice) {
      throw new ApiError(400, "!موجودی کیف پول شما کافی نیست");
    }
    const transactionResult = await prisma.$transaction(async (prisma) => {
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          walletBalance: {
            decrement: productsPrice,
          },
        },
      });

      for (let i = 0; i < orderedProductsList.length; i++) {
        const product = orderedProductsList[i];
        await prisma.product.update({
          where: {
            id: product.productId,
          },
          data: {
            sellQuantity: { increment: product.count },
            variants: {
              updateMany: {
                where: {
                  variantId: product.variantId,
                },
                data: {
                  quantity: {
                    decrement: product.count,
                  },
                },
              },
            },
          },
        });
      }

      const order = await prisma.order.create({
        data: {
          type: "directly",
          status: "done",
          totalPrice: productsPrice,
          date: moment().toISOString(),
          products: {
            set: orderedProductsList,
          },
          userId: user.id,
        },
      });
      await emptyCart(user);
      return { updatedUser, order };
    });
    return transactionResult;
  } catch (error) {
    throw new ApiError(error.statusCode, error.message);
  }
};

const priceCalculator = async (cart) => {
  const unitPrices = await getCurrentGoldPrice();
  const productIds = cart.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });
  if (products.length === 0) {
    throw new ApiError(400, "bad request");
  }
  let orderFinalPrice = 0;

  cart.forEach((request) => {
    const reqProduct = products.find((i) => i.id == request.productId);
    const variant = reqProduct.variants.find(
      (i) => i.variantId == request.variantId
    );
    const { finalPrice } = calculatePrice(reqProduct, variant, unitPrices);
    orderFinalPrice += finalPrice * request.count;
  });

  return orderFinalPrice;
};
//محاسبات خرید قسطی
const computing = async (type, value, variant) => {
  const unitPrices = await prisma.goldPrice.findFirstOrThrow({
    orderBy: {
      date: "desc",
    },
  });

  if (type === "buy-weight") {
    const purePrice = value * unitPrices[variant.weightUnit];
    const finalPrice =
      purePrice + (variant.wage - variant.discount) * purePrice;
    return Math.round(finalPrice);
  } else if (type === "buy-price") {
    const totalWeight =
      value /
      (unitPrices[variant.weightUnit] +
        (variant.wage - variant.discount) * unitPrices[variant.weightUnit]);
    return Number(totalWeight.toFixed(3));
  } else {
    throw new ApiError(400, "bad request");
  }
};

//قسط اول
const firstInstallment = async (userId, productId, variantId, body) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (user.addresses.length === 0) {
    throw new ApiError(400, "!اطلاعات آدرس وارد نشده است");
  }
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
    },
  });

  const variant = product.variants.find((variants) => {
    return variants.variantId == variantId;
  });
  if (!variant || !variant.installment.available || variant.quantity === 0) {
    throw new ApiError(400, "امکان خرید قسطی این محصول وجود ندارد");
  }

  requestedWeight =
    body.type === "buy-weight"
      ? body.value
      : await computing(body.type, body.value, variant);

  if (requestedWeight > variant.weight) {
    throw new ApiError(400, "مقدار وارد شده بیشتر از وزن یا قیمت محصول است");
  }
  if (requestedWeight < variant.installment.minWeight) {
    throw new ApiError(
      400,
      ` شما نمیتوانید برای قسط اول کمتر از ${product.installment.minWeight} گرم پرداخت کتید`
    );
  }

  // const user = await prisma.user.findUniqueOrThrow({
  //   where: {
  //     id: userId,
  //   },
  // });

  const transactionResult = await prisma.$transaction(async (prisma) => {
    let price =
      body.type === "buy-price"
        ? body.value
        : await computing(body.type, body.value, variant);

    const config = await prisma.config.findFirstOrThrow();
    price += config.commission;

    if (price < 100) {
      throw new ApiError(400, `شما نمیتوانید کمتر از ${100} پرداخت کنید`);
    }

    if (price > user.walletBalance) {
      throw new ApiError(400, `موجودی کافی نیست`);
    }
    //set deadline
    const deadLine = moment().add(variant.installment.deadLine, "days");

    const createdOrder = await prisma.order.create({
      data: {
        date: moment().toISOString(),
        deadLine: deadLine.toISOString(),
        userId: userId,
        products: [
          {
            productId: productId,
            variantId: variant.variantId,
            count: 1,
            installments: [
              {
                date: moment().toISOString(),
                weight: requestedWeight,
                price: price,
                wage: variant.wage,
              },
            ],
          },
        ],
        status: "pending",
        type: "installment",
        totalPrice: price,
        paidPrice: price,
      },
    });

    //update variant
    const updatedArray = product.variants.map((obj) => {
      if (obj.variantId === variantId) {
        return {
          ...obj,
          quantity: variant.quantity - 1,
          lockQuantity: variant.lockQuantity + 1,
        };
      }
      return obj;
    });

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        variants: updatedArray,
      },
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        walletBalance: { decrement: price },
      },
    });
    notification(createdOrder, 7);
    notification(createdOrder, 3);
    notification(createdOrder, 1);
    unlockAt(createdOrder);
    return { createdOrder };
  });
  return transactionResult;
};
// خرید قسطی
const installmentPurchase = async (userId, productId, variantId, body) => {
  try {
    const order = await prisma.order.findMany({
      where: {
        userId: userId,
        status: "pending",
        type: "installment",
      },
    });
    if (order.length === 0) {
      //قسط اول

      return await firstInstallment(userId, productId, variantId, body);
    }
    //چک کردن امکان خرید قسطی محصول و ادامه اقساط
    if (order[0].products[0].productId != productId) {
      throw new ApiError(400, `شما یک خرید قسطی تمام نشده دارید`);
    }
    //چک کردن ددلاین
    currentDate = new Date();
    if (currentDate > order[0].deadLine) {
      throw new ApiError(
        400,
        `شما دیگر قادر به پرداخت قسط  نیستید(موعد گذشته)`
      );
    }
    //ادامه اقساط
    const sumOfWeight = order[0].products[0].installments.reduce(
      (accumulator, current) => accumulator + current.weight,
      0
    );
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: productId,
      },
    });
    const variant = product.variants.find((variants) => {
      return variants.variantId == variantId;
    });

    requestedWeight =
      body.type === "buy-weight"
        ? body.value
        : await computing(body.type, body.value, variant);

    if (sumOfWeight + requestedWeight > variant.weight) {
      throw new ApiError(
        400,
        `مقدار وارد شده بیشتر از مانده قسط پرداخت نشده است`
      );
    }

    const transactionResult = await prisma.$transaction(async (prisma) => {
      let price =
        body.type === "buy-price"
          ? body.value
          : await computing(body.type, body.value, variant);

      const config = await prisma.config.findFirstOrThrow();
      price += config.commission;

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });
      if (price > user.walletBalance) {
        throw new ApiError(400, `موجودی کافی نیست`);
      }

      if (price < 100) {
        throw new ApiError(400, `شما نمیتوانید کمتر از ${100} پرداخت کنید`);
      }
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          walletBalance: { decrement: price },
        },
      });
      if (sumOfWeight + requestedWeight === variant.weight) {
        //قسط اخر
        //خرید محصول نهایی میشود
        const updatedArray = product.variants.map((obj) => {
          if (obj.variantId === variantId) {
            return { ...obj, lockQuantity: variant.lockQuantity - 1 };
          }
          return obj;
        });
        await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            sellQuantity: { increment: 1 },
            variants: updatedArray,
          },
        });

        //اضافه کردن قسط
        order[0].products[0].installments.push({
          date: moment().toISOString(),
          weight: requestedWeight,
          price: price,
          wage: variant.wage,
        });

        const updatedOrder = await prisma.order.update({
          where: {
            id: order[0].id,
          },
          data: {
            products: order[0].products[0],
            status: "done",
          },
        });
        return { updatedOrder };
      }

      //اقساط عادی
      //اضافه کردن قسط
      order[0].products[0].installments.push({
        date: moment().toISOString(),
        weight: requestedWeight,
        price: price,
        wage: variant.wage,
      });
      const updatedOrder = await prisma.order.update({
        where: {
          id: order[0].id,
        },
        data: {
          products: order[0].products[0],
        },
      });
      return { updatedOrder };
    });
    return transactionResult;
  } catch (error) {
    throw new ApiError(error.statusCode, error.message);
  }
};

const installmentPurchaseComputing = async (productId, variantId, body) => {
  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: productId,
      },
    });
    const variant = product.variants.find((variants) => {
      return variants.variantId == variantId;
    });

    const result = await computing(body.type, body.value, variant);
    return { result: result };
  } catch (error) {
    throw new ApiError(error.statusCode, "bad request");
  }
};

const emptyCart = async (user) => {
  try {
    if (user.cart) {
      await prisma.cart.update({
        where: {
          userId: user.id,
        },
        data: {
          products: {
            set: [],
          },
        },
      });
    } else {
      return;
    }
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
};

module.exports = {
  search,
  buyProduct,
  priceCalculator,
  installmentPurchase,
  installmentPurchaseComputing,
};
