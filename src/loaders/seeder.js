const { PrismaClient } = require("@prisma/client");
const moment = require("jalali-moment");

const Jnow = moment();
const prisma = new PrismaClient();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const productNames = ["ring", "earring", "Necklace", "wristband"];
const productImages = [
  "src/public/products/14619d4c-8476-4080-b8ee-83914f0da34c_c6.png",
  "src/public/products/c1a39779-f36c-48a5-a359-139bcbc92e8c_c7.png",
  "src/public/products/f5d82d1f-bdbf-48ab-899e-1e982c6a7734_c8.png",
  "src/public/products/4292f825-4e5d-4e40-8377-904358e0ae9f_pro4.jpg",
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
  const productCount = await prisma.product.count({});
  if (productCount >= 100) {
    return;
  }
  for (let i = 0; i < 100; i++) {
    await prisma.product.create({
      data: {
        title: productNames[getRandomInt(productNames.length)],
        description:
          "Lorem ipsum dolor sit amet. Aut officiis autem 33 reprehenderit porro non obcaecati ullam. Sed sint magnam rem modi rerum qui commodi ullam est illo doloremque in rerum numquam a adipisci fugiat. Eum rerum nobis est laudantium ducimus in harum omnis. ",
        category: productNames[getRandomInt(productNames.length)],
        discount: getRandomInt(4) / 100,
        profitPercentage: getRandomInt(7) / 100,
        quantity: getRandomInt(51),
        lockQuantity: 0,
        tags: { set: ["gold", "ring", "wristband"] },
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

const goldChartSeeder = async () => {
  for (let i = 1; i < 35; i++) {
    await prisma.goldPrice.create({
      data: {
        buyQuotation: Math.floor(Math.random() * (9000000 - 1000000) + 1000000),
        sellQuotation: Math.floor(
          Math.random() * (9000000 - 1000000) + 1000000
        ),
        date: Jnow.add(i, "days").toISOString(),
      },
    });
  }
  console.log("goldChart seeded");
};

module.exports = {
  productSeeder,
  goldChartSeeder,
};
