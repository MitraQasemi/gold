const Queue = require('bull');
const myQueue = new Queue('my-queue-name');
const CronJob = require('cron').CronJob;
const { goldPrice } = require("./../services/admin/goldPrice")

const job = new CronJob('0 */10 * * * *', async () => {
    await goldPrice();
    myQueue.add({ message: 'gold price updated!' });
});

module.exports = { job, myQueue }




