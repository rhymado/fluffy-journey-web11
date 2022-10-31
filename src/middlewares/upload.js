const multer = require("multer");
const path = require("path");

const limits = {
  fileSize: 2e6,
};
const fileFilter = (req, file, cb) => {
  const extName = path.extname(file.originalname);
  const allowedExt = /jpg|png/;
  if (!allowedExt.test(extName))
    return cb(new Error("Only Use Allowed Extension (JPG, PNG)"), false);
  cb(null, true);
};
const onError = (err, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(500).json({ err: "Multer Error", msg: err.message });
  }
  if (err) {
    return res
      .status(500)
      .json({ err: "Internal Server Error", msg: err.message });
  }
  console.log("Upload Success");
  next();
};

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e3)}`;
    const ext = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${suffix}${ext}`;
    cb(null, fileName);
  },
});

const diskUpload = multer({
  storage: diskStorage,
  limits,
  fileFilter,
});

const memoryStorage = multer.memoryStorage();

const memoryUpload = multer({
  storage: memoryStorage,
  limits,
  fileFilter,
});

module.exports = { diskUpload, memoryUpload, onError };
