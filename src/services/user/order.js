const { PrismaClient } = require("@prisma/client");
const { ApiError } = require("../../api/middlewares/error");

const prisma = new PrismaClient();

const getOneOrder = async (orderId) => {
  try {
    const order = await prisma.order.findUniqueOrThrow({
      where: {
        id: orderId,
      },
    });
    const productIds = order.products.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        title: true,
        thumbnailImage: true,
        weight: true,
        weightUnit: true,
      },
    });
    order.products.map((i) => {
      products.forEach((product) => {
        if (product.id == i.productId) {
          i.productDetails = product;
        }
      });
    });
    return order;
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
};

const getAllOrders = async (userId, queryObject) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        date: true,
        paidPrice: true,
        totalPrice: true,
        status: true,
        products: true,
        type: true,
        deadLine: true,
      },
      skip: Number((queryObject.page - 1) * queryObject.size),
      take: Number(queryObject.size),
    });
    const productIds = [];
    orders.map((order) => {
      order.products.map((product) => {
        productIds.push(product.productId);
      });
    });
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        title: true,
        thumbnailImage: true,
      },
    });
    orders.map((order) => {
      order.products.map((product) => {
        const productDetails = products.find((i) => i.id == product.productId);
        product.productDetails = productDetails;
      });
    });
    return orders;
  } catch (error) {
    console.log(error);
    throw new ApiError(error.statusCode || 500, error.message);
  }
};

const getOrders = async (queryObject) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        date: true,
        paidPrice: true,
        totalPrice: true,
        status: true,
        products: true,
        type: true,
        deadLine: true,
      },
      skip: Number((queryObject.page - 1) * queryObject.size),
      take: Number(queryObject.size),
    });
    const productIds = [];
    orders.map((order) => {
      order.products.map((product) => {
        productIds.push(product.productId);
      });
    });
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        title: true,
        thumbnailImage: true,
      },
    });
    orders.map((order) => {
      order.products.map((product) => {
        const productDetails = products.find((i) => i.id == product.productId);
        product.productDetails = productDetails;
      });
    });
    return orders;
  } catch (error) {
    console.log(error);
    throw new ApiError(error.statusCode || 500, error.message);
  }
};
// const canselOrder = async (orderId) => {
//   try {
//   } catch (error) {
//     throw new ApiError(error.statusCode || 500, error.message);
//   }
// };

module.exports = {
  getOneOrder,
  getAllOrders,
  getOrders
  // canselOrder,
};
