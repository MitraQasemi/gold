const { PrismaClient } = require("@prisma/client");

const uploader = require("../common/uploader")

const prisma = new PrismaClient

// GET

const getProducts = async (queryObject) => {
  const query = queryGenerator(queryObject)
  const result = await prisma.product.findMany({
    query
  })
  return result
}

// POST

const createProducts = async (req) => {

}

// PUT

const editProducts = async () => { }

// DELETE

const deleteProducts = async (productId) => {
  const rersult = prisma.product.delete({
    where: {
      id: productId
    }
  })
}

// HELPER

const queryGenerator = (queryParams) => {
  const query = {}
  if (queryParams.cat) {
    query.where.category = {
      startsWith: queryParams.cat
    }
  }
  if (queryParams.tag) {
    query.where.tags = {
      hasEvery: JSON.parse(queryParams.tag)
    }
  }
  if (queryParams.size && queryParams.page) {
    query.skip = queryParams.size * queryParams.page;
    query.take = queryParams.size
  }

  return query
}

module.exports = {
  getProducts,
  createProducts,
  editProducts,
  deleteProducts
}
// prisma.product.findMany({
//   where: {
//     category: {
//       startsWith: "/tech"
//     },
//     tags: {
//       hasEvery: ["test", "tag"]
//     }
//   },
//   take: 20,
//   skip: 16
// })