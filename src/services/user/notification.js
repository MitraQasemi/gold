const axios = require("axios");
const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");

require("dotenv").config();

const prisma = new PrismaClient();

const apiKey = process.env.KAVEH_NEGAR_API_KEY;
const sender = process.env.KAVEH_NEGAR_SENDER;

const remainingDaysNotif = async (orderId, dayCount) => {
  const order = await prisma.order.findUnique({
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
  const message = encodeURIComponent(`متن نمونه... ${dayCount} باقیمانده
      https://domain/installmentPurchase/${order.products[0].productId}/${order.products[0].variantId}`);
  const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json?receptor=${order.user.phoneNumber}&sender=${sender}&message=${message}`;
  const res = await axios.get(url);
  console.log(res.data);
};

module.exports = { remainingDaysNotif };
