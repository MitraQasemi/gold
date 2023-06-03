// const Queue = require("bull");
const moment = require("jalali-moment");
const CronJob = require("cron").CronJob;

const unlocking = require("../services/user/unlockingProduct");

// const notificationQueue = new Queue("notifications");

const unlockAt = async (order) => {
  const targetDate = new Date(moment(order.deadLine));
  const job = new CronJob(targetDate, async () => {
    await unlocking(order.id);
  });
  job.start();
};

module.exports = { unlockAt };
