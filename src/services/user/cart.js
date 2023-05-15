const axios = require("axios");
const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const addToCart = async (userId, body) => {
  const countRequest = Math.abs(body.count);
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: body.productId,
    },
  });
  const variant = product.variants.find((i) => i.variantId === body.variantId);
  if (variant.quantity < countRequest) {
    throw new ApiError(400, "There is not enough of this product");
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
      throw new ApiError(400, "There is not enough of this product");
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
      user: true,
    },
  });
  return userCart;
};

const removeFromCart = async (userId, body) => {
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
    throw new ApiError(400, ":{");
  }
  const oldProduct = user.cart.products.find(
    (i) => i.productId === body.productId && i.variantId === body.variantId
  );
  oldProduct.count -= countRequest;
  if (oldProduct.count <= 0) {
    const updatedProductsList = user.cart.products.filter(
      (i) => i.productId !== oldProduct.productId
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
};

module.exports = {
  addToCart,
  removeFromCart,
};
