const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ApiError(404, "!کابر در سیستم وجود ندارد ");
  }
  return user;
};

const editUser = async (userId, newData) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: newData,
  });
  return updatedUser;
};

module.exports = {
  getUser,
  editUser,
};
