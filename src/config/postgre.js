const { Pool } = require("pg");
// const { Pool } = pg;

const db = new Pool({
  host: "localhost",
  user: "fakhri",
  database: "fakhri",
  password: "t00r",
  port: 5433,
});

module.exports = db;
