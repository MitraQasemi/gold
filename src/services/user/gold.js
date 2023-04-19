const axios = require("axios");
const moment = require("jalali-moment");
const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config({ path: "../.env" });

moment.locale("fa");

const prisma = new PrismaClient();

const checkAllow = async (userId) => {
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
        userId: userId,
        date: {
          gte: startAt
          ,
          lt: endAt,
        },
      },
      _sum: {
        expense: true,
      },
    });
  return currentLimitation.weightLimit - totalPurchasedGold._sum.expense;
};

const computing = async (type, value) => {
  const currentPrice = await prisma.goldPrice.findFirst();
  if (type === "sell-weight") {
    const totalPrice = currentPrice.sellQuotation * value;
    return totalPrice;
  } else if (type === "sell-price") {
    const totalWeight = value / currentPrice.sellQuotation;
    return totalWeight;
  } else if (type === "buy-weight") {
    const totalPrice = currentPrice.buyQuotation * value;
    return totalPrice;
  } else if (type === "buy-price") {
    const totalWeight = value / currentPrice.buyQuotation;
    return totalWeight;
  } else {
    throw new ApiError(400, "bad request");
  }
};

const buyGold = async (userId, body) => {
  const purchaseableWeight = await checkAllow(userId);
  const requestedWeight =
    body.type === "buy-weight"
      ? body.value
      : await computing(body.type, body.value);

  if (purchaseableWeight < requestedWeight) {
    throw new ApiError(403, "you can't buy gold anymore today");
  }
  const transactionResult = await prisma.$transaction(async (prisma) => {
    const price =
      body.type === "buy-price"
        ? body.value
        : await computing(body.type, body.value);

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
        expense: requestedWeight,
        status: "place holder",
        paymentGateway: "place holder",
        details: "place holder",
      },
    });

    const walletTransaction = await prisma.walletTransaction.create({
      data: {
        userId: user.id,
        date: moment().toISOString(),
        transactionType: "buy",
        expense: price,
        status: "place holder",
        paymentGateway: "place holder",
        title: "place holder",
        weight: requestedWeight,
        quotation: 0.0, // 👈 place holder
        details: "place holder",
      },
    });

    return { updatedUser, goldTransaction, walletTransaction };
  });

  return transactionResult;
};

const sellGold = async (userId, body) => {
  const salableWeight = await checkAllow(userId);
  const requestedWeight =
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

    const price =
      body.type === "sell-price"
        ? body.value
        : await computing(body.type, body.value);

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
        expense: requestedWeight,
        status: "place holder",
        paymentGateway: "place holder",
        details: "place holder",
      },
    });

    const walletTransaction = await prisma.walletTransaction.create({
      data: {
        userId: user.id,
        date: moment().toISOString(),
        transactionType: "sell",
        expense: price,
        status: "place holder",
        paymentGateway: "place holder",
        title: "place holder",
        weight: requestedWeight,
        quotation: 0.0, // 👈 place holder
        details: "place holder",
      },
    });

    return { updatedUser, goldTransaction, walletTransaction };
  });

  return transactionResult;
};

module.exports = { computing, buyGold, sellGold };
