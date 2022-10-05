const express = require("express");

// import db
const postgreDb = require("./src/config/postgre"); //src\config\postgre.js

// init express application
const server = express();

const PORT = 8080;

postgreDb
  .connect()
  .then(() => {
    // pastikan db connect dulu, baru jalankan server
    console.log("DB connected");

    server.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });

    // http route
    // http://localhost:8080/
    server.get("/", (req, res) => {
      res.json({
        msg: "Welcome",
      });
    });
    // http://localhost:8080/api/v1/books
    server.get("/api/v1/books", async (req, res) => {
      try {
        const query = "select id, title, author from books";
        const response = await postgreDb.query(query);
        res.status(200).json({
          result: response.rows,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          msg: "Internal Server Error",
        });
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
