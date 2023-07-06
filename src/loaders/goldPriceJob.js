const { job } = require("./../jobs/goldPriceJob");


const jobsLoader = () => {
    job.start();
}
module.exports = jobsLoader;