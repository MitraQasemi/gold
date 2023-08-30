const { PrismaClient } = require("@prisma/client");
const moment = require("moment-timezone");
const now = moment();
const prisma = new PrismaClient();

const getSaledGold = async () => {
  const result = await prisma.goldTransaction.findMany({
    where: {
      date: {
        gte: now.subtract(30, "days").toISOString(),
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  console.log(result);
};

module.exports = {
  getSaledGold,
};
