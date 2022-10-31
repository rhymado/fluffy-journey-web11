const express = require("express");

const booksRouter = express.Router();
const { get, create, edit, drop } = require("../controllers/books");
// const allowedRole = require("../middlewares/allowedRole");
const isLogin = require("../middlewares/isLogin");
const validate = require("../middlewares/validate");
const { diskUpload } = require("../middlewares/upload");
// http://localhost:8080/api/v1/books/
booksRouter.get("/", get);

// booksRouter.post("/", isLogin(), allowedRole("admin", "user"), create);
booksRouter.post(
  "/",
  isLogin(),
  validate.body("title", "author", "published_date", "publisher"),
  diskUpload.single("image"),
  create
);

// id
// /api/v1/books/{id}
// params => req.params.namaVariabel
booksRouter.patch("/:id", edit);

booksRouter.delete("/:id", drop);

module.exports = booksRouter;
