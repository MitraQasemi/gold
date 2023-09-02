const { PrismaClient } = require("@prisma/client");
const moment = require("jalali-moment");

const Jnow = moment();
const prisma = new PrismaClient();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const productNames = ["ring", "earring", "Necklace", "wristband"];
const productImages = [
  "http://91.107.160.88:3001/bc698acf-16c0-4e0d-8737-aa3e3c32f339_.png",
  "http://91.107.160.88:3001/6c3e9fc0-35e5-4090-b403-870391006d59_.png",
  "http://91.107.160.88:3001/aec7c9f0-9316-4369-bf62-6d5bb17ab79e_.png",
  "http://91.107.160.88:3001/5376d0d0-8a6a-4fdd-8fc7-804385c82cd4_.jpg",
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

module.exports = {
  productSeeder,
};
