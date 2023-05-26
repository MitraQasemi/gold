const Queue = require("bull");
const moment = require("jalali-moment");
const CronJob = require("cron").CronJob;

const { remainingDaysNotif } = require("../services/user/notification");

const notificationQueue = new Queue("notifications");

const notification = async (order, remainingDays) => {
  const targetDate = new Date(
    moment(order.deadLine).subtract(remainingDays, "days")
  );
  const job = new CronJob(targetDate,async () => {
    await remainingDaysNotif(order.id, remainingDays);
  });
  job.start();
};

module.exports = { notification };