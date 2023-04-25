const Queue = require('bull');
const myQueue = new Queue('my-queue-name');
const CronJob = require('cron').CronJob;
const { goldPrice } = require("./../services/admin/goldPrice")
//every 2 hures 0 */2 * * *
const job = new CronJob("0 */2 * * *", async () => {
    await goldPrice();
    myQueue.add({ message: 'gold price updated!' });
});

module.exports = { job, myQueue }




