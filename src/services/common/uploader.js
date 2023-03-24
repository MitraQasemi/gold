const fs = require('fs');
const path = require('path')
const formidable = require('formidable');

module.exports = (req, directory) => {

  const form = new formidable.IncomingForm();
  form.
  form.parse(req, function (err, fields, files) {
    if (err) throw err;

    const oldPath = files.image.filepath;
    const newPath = path.join("src", "public", directory, Date.now() + files.image.originalFilename)

    const rawData = fs.readFileSync(oldPath)
    fs.writeFile(newPath, rawData, (err) => {
      if (err) throw err;
    })
  })
}
