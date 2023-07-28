const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getConfigInfo = async () => {
  const configInfo = await prisma.config.findFirst();
  if (!configInfo) {
    throw new ApiError(500, "internall error");
  }
  return configInfo;
};

module.exports = { getConfigInfo };
