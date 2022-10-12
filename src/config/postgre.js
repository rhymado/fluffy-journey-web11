const { Pool } = require("pg");
// const { Pool } = pg;

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATA,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
});

module.exports = db;
