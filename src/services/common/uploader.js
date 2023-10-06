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
        if (err || !file.image) {
          reject(err || new Error(" !عکس قرار داده نشده "));
          return; // Add this line to exit the function here
        }
        let type = file.image.originalFilename.split(".");
        const newPath = path.join('./src/public', directory, uuid.v4() + '_.' + type[type.length - 1]);
        //const newPath = path.join('./src/public', directory, uuid.v4() + '_' + file.image.originalFilename)
        const result = newPath.split(path.sep);
        fs.createReadStream(file.image.filepath)
          .pipe(fs.createWriteStream(newPath))
          .on("finish", () => resolve(`http://82.115.18.249/${result[result.length - 1]}`))
          .on("error", (error) => reject(error));
      });
    });
  } catch (error) {
    throw new ApiError(error.statusCode, error.message);
  }
};
