const { PrismaClient } = require("@prisma/client");
const { computing } = require("./gold");

const prisma = new PrismaClient();

const unlocking = async (orderId) => {
  const order = await prisma.order.findUniqueOrThrow({
    where: {
      id: orderId,
    },
    include: {
      user: true,
    },
  });
  if (order.status === "done") {
    return;
  }
  const paidWeight = order.products[0].installments.reduce(
    (acc, cur) => acc + cur.weight,
    0
  );
  const priceOfPaidWeight = await computing("sell-weight", paidWeight);
  await prisma.user.update({
    where: {
      id: order.userId,
    },
    data: {
      walletBalance: {
        increment: priceOfPaidWeight,
      },
    },
  });
  await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      status: "faild",
    },
  });
};

module.exports = unlocking;
