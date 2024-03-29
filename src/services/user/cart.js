const axios = require("axios");
const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");
const { attachPriceToCart } = require("./attachPrice");

const prisma = new PrismaClient();

const addToCart = async (userId, body) => {
  try {
    const countRequest = Math.abs(body.count);
    const product = await prisma.product.findUnique({
      where: {
        id: body.productId,
      },
    });

    if (!product) {
      throw new ApiError(400, "!این محصول در سیستم وجود ندارد");
    }
    const variant = product.variants.find(
      (i) => i.variantId === body.variantId
    );
    if (!variant) {
      throw new ApiError(400, "!این محصول در سیستم وجود ندارد");
    }
    if (variant.quantity < countRequest) {
      throw new ApiError(400, "!تعداد کافی از این محصول وجود ندارد ");
    }
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        cart: true,
      },
    });
    if (!user.cart) {
      const userCart = await prisma.cart.create({
        data: {
          userId: user.id,
          products: {
            set: {
              productId: body.productId,
              variantId: body.variantId,
              count: countRequest,
            },
          },
        },
        include: {
          user: true,
        },
      });
      return userCart;
    }
    const oldProduct = user.cart.products.find(
      (i) => i.productId === body.productId && i.variantId === body.variantId
    );
    if (oldProduct) {
      oldProduct.count += countRequest;
      if (variant.quantity < oldProduct.count) {
        throw new ApiError(400, "!تعداد کافی از این محصول وجود ندارد ");
      }
      const userCart = await prisma.cart.update({
        where: {
          userId: user.id,
        },
        data: {
          products: {
            set: user.cart.products,
          },
        },
        include: {
          user: true,
        },
      });
      return userCart;
    }
    const userCart = await prisma.cart.update({
      where: {
        userId: user.id,
      },
      data: {
        products: {
          push: {
            productId: body.productId,
            variantId: body.variantId,
            count: countRequest,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });
    return userCart;
  } catch (error) {
    throw new ApiError(error.statusCode, error.message);
  }
};

const removeFromCart = async (userId, body) => {
  try {
    const countRequest = Math.abs(body.count);
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        cart: true,
      },
    });
    if (!user.cart) {
      throw new ApiError(400, "!شما سبد خرید ندارید");
    }
    const oldProduct = user.cart.products.find(
      (i) => i.productId === body.productId && i.variantId === body.variantId
    );
    if (!oldProduct) {
      throw new ApiError(400, "!محصول مورد نظر در سبد خرید شما وجود ندارد");
    }
    oldProduct.count -= countRequest;
    if (oldProduct.count <= 0) {
      const updatedProductsList = user.cart.products.filter(
        (i) =>
          i.productId !== oldProduct.productId ||
          i.variantId !== oldProduct.variantId
      );
      const userCart = await prisma.cart.update({
        where: {
          userId: user.id,
        },
        data: {
          products: {
            set: updatedProductsList,
          },
        },
        include: {
          user: true,
        },
      });
      return userCart;
    }
    const userCart = await prisma.cart.update({
      where: {
        userId: user.id,
      },
      data: {
        products: {
          set: user.cart.products,
        },
      },
      include: {
        user: true,
      },
    });
    return userCart;
  } catch (error) {
    throw new ApiError(error.statusCode, error.message);
  }
};

const getCart = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      cart: true,
    },
  });
  if (!user) {
    throw new ApiError(401, "!کاربر مورد نظر یافت نشد");
  }
  if (!user.cart) {
    throw new ApiError(400, "!شما سبد خرید ندارد");
  }
  const result = await attachPriceToCart(user.cart.products);
  return result;
};
module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};
