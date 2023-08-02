const moment = require("jalali-moment");
const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");

moment.locale("fa");

const prisma = new PrismaClient();

const checkAllow = async (userId, transactionType) => {
  const now = moment();
  const currentHouer = now.format("HH:mm");

  const config = await prisma.config.findFirstOrThrow();
  const currentLimitation = config.goldPurchaseLimit.find(
    (Lim) => Lim.startAt <= currentHouer && Lim.endAt > currentHouer
  );

  const startAt = moment(`${currentLimitation.startAt}`, "HH:mm").toISOString();
  const endAt = moment(`${currentLimitation.endAt}`, "HH:mm").toISOString();

  const totalPurchasedGold = await prisma.goldTransaction.aggregate({
    where: {
      userId,
      transactionType,
      date: {
        gte: startAt,
        lt: endAt,
      },
    },
    _sum: {
      weight: true,
    },
  });

  return currentLimitation.weightLimit - totalPurchasedGold._sum.weight;
};

const computing = async (type, value) => {
  const currentPrice = await prisma.goldPrice.findFirstOrThrow({
    orderBy: {
      date: "desc",
    },
  });
  if (type === "sell-weight") {
    const totalPrice = currentPrice.sellQuotation * value;
    return Math.round(totalPrice);
  } else if (type === "sell-price") {
    const totalWeight = value / currentPrice.sellQuotation;
    return Number(totalWeight.toFixed(3));
  } else if (type === "buy-weight") {
    const totalPrice = currentPrice.buyQuotation * value;
    return Math.round(totalPrice);
  } else if (type === "buy-price") {
    const totalWeight = value / currentPrice.buyQuotation;
    return Number(totalWeight.toFixed(3));
  } else {
    throw new ApiError(400, "bad request");
  }
};

const buyGold = async (userId, body) => {
  const purchaseableWeight = await checkAllow(userId, "buy");
  const requestedWeight =
    body.type === "buy-weight"
      ? body.value
      : await computing(body.type, body.value);

  if (purchaseableWeight < requestedWeight) {
    throw new ApiError(403, "you can't buy gold anymore today");
  }

  const transactionResult = await prisma.$transaction(async (prisma) => {
    const config = await prisma.config.findFirstOrThrow();

    let price =
      body.type === "buy-price"
        ? body.value
        : await computing(body.type, body.value);

    if (config.minPrice > price) {
      throw new ApiError(403, "the price is less than minimum price");
    }

    price += config.commission;

    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      console.log(error);
    }
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    if (user.walletBalance < price) {
      throw new ApiError(403, "your wallet balance is not enough");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        goldBalance: {
          increment: requestedWeight,
        },
        walletBalance: {
          decrement: price,
        },
      },
    });

    const goldTransaction = await prisma.goldTransaction.create({
      data: {
        userId: user.id,
        date: moment().toISOString(),
        transactionType: "buy",
        weight: requestedWeight,
        price: price,
        trackingCode: `${Date.now()}${Math.floor(
          Math.random() * (99000 - 10000) + 10000
        )}`,
        status: "تایید شده",
        paymentGateway: "place holder",
        details: "place holder",
      },
    });

    return { updatedUser, goldTransaction };
  });

  return transactionResult;
};

const sellGold = async (userId, body) => {
  let salableWeight = await checkAllow(userId, "sell");
  let requestedWeight =
    body.type === "sell-weight"
      ? body.value
      : await computing(body.type, body.value);

  if (salableWeight < requestedWeight) {
    throw new ApiError(403, "you can't sell gold anymore today");
  }
  const transactionResult = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    if (user.goldBalance < requestedWeight) {
      throw new ApiError(403, "your gold balance is not enough");
    }

    const config = await prisma.config.findFirstOrThrow();

    let price =
      body.type === "sell-price"
        ? body.value
        : await computing(body.type, body.value);

    price -= config.commission;

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        goldBalance: {
          decrement: requestedWeight,
        },
        walletBalance: {
          increment: price,
        },
      },
    });

    const goldTransaction = await prisma.goldTransaction.create({
      data: {
        userId: user.id,
        date: moment().toISOString(),
        transactionType: "sell",
        weight: requestedWeight,
        price: price,
        trackingCode: `${Date.now()}${Math.floor(
          Math.random() * (99000 - 10000) + 10000
        )}`,
        status: "تایید شده",
        paymentGateway: "place holder",
        details: "place holder",
      },
    });

    return { updatedUser, goldTransaction };
  });

  return transactionResult;
};

const getGoldTransactions = async (userId, queryObject) => {
  const goldTransactions = await prisma.goldTransaction.findMany({
    where: {
      userId,
    },
    skip: Number(queryObject.size * (queryObject.page - 1)) || 0,
    take: Number(queryObject.size),
  });
  const transactionCount = await prisma.goldTransaction.count({
    where: {
      userId,
    },
  });

  return { transactions: goldTransactions, count: transactionCount };
};

module.exports = { computing, buyGold, sellGold, getGoldTransactions };
