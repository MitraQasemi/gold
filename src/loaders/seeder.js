const { PrismaClient } = require("@prisma/client");
const moment = require("jalali-moment");

const Jnow = moment();
const prisma = new PrismaClient();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const productNames = ["ring", "earring", "Necklace", "wristband"];
const productImages = [
  "http://82.11518.249/8820cd49-f498-4bcf-ac4c-2f60d74440b0_.png",
  "http://82.11518.249/77b9fe73-b213-4f07-9cb0-a3856529d643_.png",
  "http://82.11518.249/eec47095-ffdb-4079-a9e9-c51f76d33269_.png",
  "http://82.11518.249/b5b1829b-eeb4-4add-95b2-5bcd34702696_.png",
];
const tags = [
  ["gold", "18"],
  ["gold", "24"],
];
const installment = [
  {
    available: true,
    deadLine: 120,
    minWeight: 0.5,
  },
  {
    available: false,
    deadLine: 0,
    minWeight: 0,
  },
];

const now = new Date();

const productSeeder = async () => {
  const productCount = await prisma.product.count();
  if (productCount >= 99) {
    return;
  }
  for (let i = 0; i < 99; i++) {
    const randomName = productNames[getRandomInt(productNames.length)];
    await prisma.product.create({
      data: {
        title: randomName,
        description:
          "Lorem ipsum dolor sit amet. Aut officiis autem 33 reprehenderit porro non obcaecati ullam. Sed sint magnam rem modi rerum qui commodi ullam est illo doloremque in rerum numquam a adipisci fugiat. Eum rerum nobis est laudantium ducimus in harum omnis. ",
        category: randomName,
        discount: getRandomInt(4) / 100,
        profitPercentage: getRandomInt(7) / 100,
        quantity: getRandomInt(51),
        lockQuantity: 0,
        tags: { set: tags[getRandomInt(tags.length)] },
        wage: getRandomInt(8) / 100,
        installment: {
          set: installment[getRandomInt(installment.length)],
        },
        variants: {
          set: [
            {
              discount: 0.01,
              installment: {
                available: true,
                deadLine: 120,
                minWeight: 0.5,
              },
              lockQuantity: getRandomInt(11),
              quantity: getRandomInt(100),
              variantId: 1,
              wage: getRandomInt(5) / 100,
              weight: 2 + getRandomInt(5) / 10,
              weightUnit: "buyQuotation",
              variants: [],
            },
            {
              discount: 0.01,
              installment: {
                available: false,
                deadLine: 0,
                minWeight: 0,
              },
              lockQuantity: getRandomInt(11),
              quantity: getRandomInt(100),
              variantId: 2,
              wage: getRandomInt(5) / 100,
              weight: 2 + getRandomInt(5) / 10,
              weightUnit: "sellQuotation",
              variants: [],
            },
          ],
        },
        weight: 2 + getRandomInt(5) / 10,
        weightUnit: "buyQuotation",
        date: now.toISOString(),
        sellQuantity: getRandomInt(10),
        image: {
          set: productImages,
        },
        thumbnailImage: productImages[getRandomInt(productImages.length)],
      },
    });
  }
  console.log("products seeded");
};

const goldTransactionSeeder = async () => {
  const transactionCount = await prisma.goldTransaction.count();
  if (transactionCount >= 50) {
    return;
  }
  const transactionType = ["sell", "buy"];
  let month = 8;
  let day = 1;
  let hours = 0;
  for (let i = 0; i < 30; i++) {
    day += i;
    if (day == 32) {
      day = 1;
      month = 9;
    }
    prisma.goldTransaction.createMany({
      data: [
        {
          details: "from seeder",
          paymentGateway: "test",
          price: 250000000,
          status: "done",
          trackingCode: "123456789",
          userId: "64f5c82863626027d059ba34",
          weight: 1 + getRandomInt(10) / 10,
          date: new Date(`2023-0${month}-${day} 00:00`),
          transactionType:
            transactionType[getRandomInt(transactionType.length)],
        },
        {
          details: "from seeder",
          paymentGateway: "test",
          price: 250000000,
          status: "done",
          trackingCode: "123456789",
          userId: "64f5c82863626027d059ba34",
          weight: 1 + getRandomInt(10) / 10,
          date: new Date(`2023-0${month}-${day} 08:40`),
          transactionType:
            transactionType[getRandomInt(transactionType.length)],
        },
        {
          details: "from seeder",
          paymentGateway: "test",
          price: 250000000,
          status: "done",
          trackingCode: "123456789",
          userId: "64f5c82863626027d059ba34",
          weight: 1 + getRandomInt(10) / 10,
          date: new Date(`2023-0${month}-${day} 23:55`),
          transactionType:
            transactionType[getRandomInt(transactionType.length)],
        },
      ],
    });
  }
};

module.exports = {
  productSeeder,
  goldTransactionSeeder
};
