// const Queue = require('bull');
// const myQueue = new Queue('my-queue-name');
const CronJob = require('cron').CronJob;
const { goldPrice } = require("./../services/admin/goldPrice")
//every 2 hures 0 */2 * * *
const job = new CronJob("*/20 * * * * *", async () => {
    await goldPrice();
    // myQueue.add({ message: '\n\nagold price updated!' });
});

module.exports = { job }

// const Queue = require('bull');
// const Redis = require('ioredis');
// const CronJob = require('cron').CronJob;
// const { goldPrice } = require("./../services/admin/goldPrice");

// const redisConfig = {
//   host: 'redis',
//   port: 6379,
//   maxRetriesPerRequest: 50,
// };

// const redisClient = new Redis(redisConfig);
// const myQueue = new Queue('my-queue-name', { redis: redisClient });

// const job = new CronJob("0/15 * * * * *", async () => {
//   await goldPrice();
//   myQueue.add({ message: '\nagold price updated!' });
// });

// module.exports = { job, myQueue };



