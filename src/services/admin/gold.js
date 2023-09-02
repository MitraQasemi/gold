const { PrismaClient } = require("@prisma/client");
const moment = require("moment");
const { ApiError } = require("../../api/middlewares/error");

const prisma = new PrismaClient();

const getBuyAndSaleReports = async () => {
  const thirtyDaysAgo = moment().subtract(30, "days");
  const transactionsOfLast30Days = await prisma.goldTransaction.findMany({
    where: {
      date: {
        gte: thirtyDaysAgo.toISOString(),
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  if (transactionsOfLast30Days.length == 0) {
    throw new ApiError(400, "در طول 30 روز گذشته معامله‌ای صورت نگرفته")
  }
  const sevenDaysAgo = moment().subtract(7, "days");
  const transactionsOfLast7Days = transactionsOfLast30Days.filter(
    (i) => i.date >= sevenDaysAgo
  );
  const twentyFourHoursAgo = moment().subtract(24, "hours");
  const transactionsOfLast24Hours = transactionsOfLast30Days.filter(
    (i) => i.date > twentyFourHoursAgo
  );
  const buyAndSaleReports = {
    last30Days: { buy: 0, sale: 0 },
    last7Days: { buy: 0, sale: 0 },
    last24Hours: { buy: 0, sale: 0 },
  };
  transactionsOfLast30Days.map((transaction) => {
    if (transaction.transactionType === "buy") {
      buyAndSaleReports.last30Days.buy += transaction.weight;
    } else {
      buyAndSaleReports.last30Days.sale += transaction.weight;
    }
  });
  transactionsOfLast7Days.map((transaction) => {
    if (transaction.transactionType === "buy") {
      buyAndSaleReports.last7Days.buy += transaction.weight;
    } else {
      buyAndSaleReports.last7Days.sale += transaction.weight;
    }
  });
  transactionsOfLast24Hours.map((transaction) => {
    if (transaction.transactionType === "buy") {
      buyAndSaleReports.last24Hours.buy += transaction.weight;
    } else {
      buyAndSaleReports.last24Hours.sale += transaction.weight;
    }
  });
  return buyAndSaleReports;
};

module.exports = {
  getBuyAndSaleReports,
};
