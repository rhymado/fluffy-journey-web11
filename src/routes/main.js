const express = require("express");

// import subrouter
const booksRouter = require("./books");
const historyRouter = require("./history");
const usersRouter = require("./users");

const mainRouter = express.Router();

const prefix = "/api/v1";

// sambungkan subrouter dengan mainRouter
mainRouter.use(`${prefix}/books`, booksRouter);
// untuk rute /api/v1/books ditangani oleh booksRouter
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/history`, historyRouter);
// http route
// http://localhost:8080/
mainRouter.get("/", (req, res) => {
  res.json({
    msg: "Welcome",
  });
});

module.exports = mainRouter;
