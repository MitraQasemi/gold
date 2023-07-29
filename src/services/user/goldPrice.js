const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getGoldPrice = async () => {
  const configInfo = await prisma.goldPrice.findFirst({
    orderBy: {
      date: "desc",
    },
  });
  if (!configInfo) {
    throw new ApiError(500, "internall error");
  }
  return configInfo;
};

module.exports = { getGoldPrice };
