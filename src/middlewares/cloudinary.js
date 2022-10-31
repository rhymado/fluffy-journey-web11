const DatauriParser = require("datauri/parser");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const uploader = async (req, res, next) => {
  const { body } = req;
  const filename = `${body.purpose}_${body.user_id}`;
  const parser = new DatauriParser();
  const file = parser.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer
  );

  try {
    const result = await cloudinary.uploader.upload(file.content, {
      public_id: filename,
      folder: "fluffy_web",
    });
    req.file = result;
    next();
  } catch (err) {
    console.log("error cloud");
    res.status(500).json(err);
  }
};

module.exports = uploader;
