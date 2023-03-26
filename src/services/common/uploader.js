const fs = require('fs');
const path = require('path')
const uuid = require("uuid")
const formidable = require('formidable');

module.exports = (req, directory) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, file) => {
      if (err || !file.image) reject(err || new Error("Image is not provided."));

      const newPath = path.join(process.cwd(), "src", "public", directory, uuid.v4() + '_' + file.image.originalFilename)

      fs.createReadStream(file.image.filepath)
        .pipe(fs.createWriteStream(newPath))
        .on("finish", () => resolve(newPath.split("\\")))
        .on("error", (error) => reject(error));
    });
  });
};
