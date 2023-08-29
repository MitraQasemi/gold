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
          throw new ApiError(400, 'عکس قرار داده نشده');
        }
        let type = file.image.originalFilename.split(".");
        const newPath = path.join('./src/public', directory, uuid.v4() + '_.' + type[type.length - 1]);
        //const newPath = path.join('./src/public', directory, uuid.v4() + '_' + file.image.originalFilename)
        const result = newPath.split(path.sep);
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
