const express = require("express");

// import subrouter
const booksRouter = require("./books");
const historyRouter = require("./history");
const usersRouter = require("./users");
const authRouter = require("./auth");

// import middleware
const imageUpload = require("../middlewares/upload");

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
mainRouter.post("/", imageUpload.single("image"), (req, res) => {
  res.json({ url: `/images/${req.file.filename}` });
});

module.exports = mainRouter;
