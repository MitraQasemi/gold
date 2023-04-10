const { job, myQueue } = require("./../jobs/goldPriceJob");


const jobsLoader = () => {
    job.start();
    myQueue.process((job) => {
        console.log(job.data.message);
    });
}
module.exports = jobsLoader;