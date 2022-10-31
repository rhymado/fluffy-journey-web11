require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// import db
// const postgreDb = require("./src/config/postgre"); //src\config\postgre.js
// import mainRouter
const mainRouter = require("./src/routes/main");
// init express application
const server = express();
const PORT = 8080;

// postgreDb
//   .connect()
//   .then(() => {
// pastikan db connect dulu, baru jalankan server
// console.log("DB connected");
server.use(
  cors({
    origin: "*",
  })
);
// pasang parser untuk body
server.use(express.static("./public"));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
// extended true => parsing menggunakan qs => bisa memproses nested object
// extended false => parsing menggunakan querystring => tidak bisa memproses nested object
// semua request ke server akan didelegasikan ke mainRouter
server.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
server.use(mainRouter);
// server siap menerima request di port
server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
// })
// .catch((err) => {
//   console.log(err);
// });
