const fs = require('fs');
const path = require('path')
const uuid = require("uuid")
const formidable = require('formidable');
const { ApiError } = require("../../api/middlewares/error")

module.exports = (req, directory) => {
  try {
    return new Promise((resolve, reject) => {
      const form = formidable({ multiples: false });
      form.parse(req, (err, fields, file) => {
        if (err || !file.image) reject(err || new Error("Image is not provided."));
        const newPath = path.join('./src/public', directory, uuid.v4() + '_' + file.image.originalFilename)
        console.log(newPath);
        const result = newPath.split("\\");
        console.log(result);
          fs.createReadStream(file.image.filepath)
            .pipe(fs.createWriteStream(newPath))
            .on("finish", () => resolve(`http://91.107.160.88:3001/${result[result.length - 1]}`))
            .on("error", (error) => reject(error));
      });
    });
  } catch (error) {
    throw new ApiError(error.statusCode, error.message);
  }
};
