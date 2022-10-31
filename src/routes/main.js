const express = require("express");

// import subrouter
const booksRouter = require("./books");
const historyRouter = require("./history");
const usersRouter = require("./users");
const authRouter = require("./auth");

// import middleware
const {
  diskUpload,
  memoryUpload,
  errorHandler,
} = require("../middlewares/upload");
const cloudinaryUploader = require("../middlewares/cloudinary");

const redisClient = require("../config/redis");

const mainRouter = express.Router();

const prefix = "/api/v1";

// sambungkan subrouter dengan mainRouter
mainRouter.use(`${prefix}/books`, booksRouter);
// untuk rute /api/v1/books ditangani oleh booksRouter
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/history`, historyRouter);
mainRouter.use(`${prefix}/auth`, authRouter);
// http route
// http://localhost:8080/
mainRouter.get("/", (req, res) => {
  res.json({
    msg: "Welcome",
  });
});
mainRouter.post(
  "/",
  (req, res, next) =>
    diskUpload.single("image")(req, res, (err) => {
      errorHandler(err, res, next);
    }),
  (req, res) => {
    res.json({ url: `/images/${req.file.filename}` });
  }
);
mainRouter.get("/redis/:key", async (req, res) => {
  try {
    await redisClient.connect();
    const value = await redisClient.get(req.params.key);
    res.status(200).json({ msg: "Success", data: { [req.params.key]: value } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
mainRouter.post("/redis/:key", async (req, res) => {
  try {
    await redisClient.connect();
    await redisClient.set(req.params.key, JSON.stringify(req.body));
    res.status(200).json({ msg: "Success" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
mainRouter.patch("/cors", (req, res) => {
  console.log(req.query);
  res.status(200).json({ msg: "Welcome" });
});
mainRouter.post(
  "/cloud",
  (req, res, next) =>
    memoryUpload.single("image")(req, res, (err) => {
      errorHandler(err, res, next);
    }),
  cloudinaryUploader,
  (req, res) => {
    // console.log(req.file);
    res.status(200).json({
      msg: "Upload Success",
      data: {
        url: req.file.url,
        secure: req.file.secure_url,
      },
    });
  }
);

module.exports = mainRouter;
