const axios = require("axios");
const moment = require("jalali-moment");
const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config({ path: "../.env" });

moment.locale("fa");

const prisma = new PrismaClient();

const computing = async (type, value) => {
  const currentPrice = await prisma.goldPrice.findFirst();
  if (type === "sell-weight") {
    const totalPrice = currentPrice.sellQuotation * value;
    return totalPrice.toFixed(3);
  } else if (type === "sell-price") {
    const totalWeight = value / currentPrice.sellQuotation;
    return totalWeight.toFixed(3);
  } else if (type === "buy-weight") {
    const totalPrice = currentPrice.buyQuotation * value;
    return totalPrice.toFixed(3);
  } else if (type === "buy-price") {
    const totalWeight = value / currentPrice.buyQuotation;
    return totalWeight.toFixed(3);
  } else {
    throw new ApiError(400, "bad request");
  }
};
/**
     const currentPrice = await prisma.goldPrice.findFirst();
    if (type === "se-we" && weight) {
      const totalPrice = currentPrice.sellQuotation * weight;
      return totalPrice.toFixed(3);
    } else if (type === "bu-we" && weight) {
      const totalPrice = currentPrice.buyQuotation * weight;
      return totalPrice.toFixed(3);
    } else if (type === "se-pr" && price) {
      const totalWeight = price / currentPrice.sellQuotation;
      return totalWeight.toFixed(3);
    } else if (type === "bu-pr" && price) {
      const totalWeight = price / currentPrice.buyQuotation;
      return totalWeight.toFixed(3);
    } else {
      return "there is no valid parameters";
 */
const buyGold = async (userId, body) => {
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
        gte: startAt,
        lt: endAt,
      },
    },
    _sum: {
      expense: true,
    },
  });

  if (currentLimitation.weightLimit >= totalPurchasedGold._sum.expense) {
    const transactionResult = await prisma.$transaction(async (prisma) => {

      const price = body.type === "buy-price" ? body.value : await computing(body.type, body.value);

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });
      
      if (user.walletBalance < price) {
        throw new ApiError(403, "your wallet balance is not enough");
      }
      
      const weight = await computing("buy-price", price);

      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          goldBalance: {
            increment: weight,
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
          expense: weight,
          status: "place holder",
          paymentGateway: "place holder",
          details: "place holder",
        },
      });

      const walletTransaction = await prisma.walletTransaction.create({
        data: {
          userId: user.id,
          date: moment().toISOString(),
          expense: price,
          status: "place holder",
          paymentGateway: "place holder",
          title: "place holder",
          weight: weight,
          quotation: 0.0, // 👈 place holder
          details: "place holder",
        },
      });

      return { updatedUser, goldTransaction, walletTransaction };
    });

    return transactionResult;
  } else {
    throw new ApiError(403, "you can't buy gold anymore");
  }
};
module.exports = { computing, buyGold };
