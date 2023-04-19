const { PrismaClient } = require("@prisma/client")
const { ApiError } = require("../../api/middlewares/error")
const moment = require("jalali-moment");
moment.locale("fa");
const prisma = new PrismaClient()

const goldChart = async () => {
  try {
    const result = await prisma.goldPrice.aggregateRaw({
      pipeline: [
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
              day: { $dayOfMonth: "$date" },
              hour: { $hour: "$date" }
            }, averageField: { $avg: "$buyQuotation" }
          },
        },
        {
          $sort: {
            "_id.year": -1,
            "_id.month": -1,
            "_id.day": -1,
            "_id.hour":-1
          }
        },
        {
          $limit: 30
        }
      ],
    })

    return result;

  } catch (error) {
    throw new ApiError(500, error.message);
  }
}

module.exports = { goldChart }