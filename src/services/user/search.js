const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const search = async (word) => {
  const result = await prisma.product.findMany({
    where: {
      OR: [
        {
          title: {
            contains: word,
          },
        },
        {
          description: {
            contains: word,
          },
        },
        {
          tags: {
            has: word,
          },
        },
      ],
    },
  });

  return result;
};

module.exports = {
  search,
};
