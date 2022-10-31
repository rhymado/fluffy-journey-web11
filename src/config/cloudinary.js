const cloudinary = require("cloudinary").v2;
// const { createCloudinaryStorage } = require("multer-storage-cloudinary");

// const storage = createCloudinaryStorage({
//   cloudinary,
//   params: { public_id },
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

module.exports = cloudinary;
