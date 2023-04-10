const axios = require("axios");
const moment = require("jalali-moment");
const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config({ path: "../.env" });

moment.locale("fa");

const prisma = new PrismaClient();

const computing = async (type, weight, price) => {
  try {
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
    }
  } catch (error) {
    throw new ApiError(400, "bad request");
  }
};

const buyGold = async (userId) => {
  const now = moment();
  const currentHouer = now.format("HH:mm");

  const config = await prisma.config.findFirstOrThrow({});

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
    // ETC
  } else {
    throw new ApiError(403, "you can't buy gold anymore");
  }
};
module.exports = { computing, buyGold };
