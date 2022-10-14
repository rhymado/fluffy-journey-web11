const postgreDb = require("../config/postgre");

const getBooks = (queryParams) => {
  return new Promise((resolve, reject) => {
    // const bookSchema = {
    //   table: "books",
    //   alias: "b",
    //   column: {
    //     id: "number",
    //     title: "string",
    //     author: "string",
    //     publisher: "string",
    //     genre: "string",
    //     published_date: "date",
    //   },
    // };
    // asumsi query params selalu berisi title dan author
    let query = "select id, title, author from books b ";
    const values = [];
    const whereParams = Object.keys(queryParams).filter((key) =>
      ["title", "author"].includes(key)
    );
    if (whereParams.length > 0) query += "where ";
    whereParams.forEach((key) => {
      if (values.length > 0) query += "and ";
      query += `lower(b.${key}) like lower('%' || $${
        values.length + 1
      } || '%') `;
      values.push(String(queryParams[key]));
    });
    // paginasi biasanya diwakili dengan query page dan limit
    const page = Number(queryParams.page);
    const limit = Number(queryParams.limit);
    const offset = (page - 1) * limit;
    query += `limit $${values.length + 1} offset $${values.length + 2}`;
    values.push(limit, offset);
    postgreDb.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};
const createBooks = (body) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into books (title, author, published_date, publisher) values ($1,$2,$3,$4)";
    // for loop query += ",($5,$6,$7,$8)";
    const { title, author, published_date, publisher } = body;
    postgreDb.query(
      query,
      [title, author, published_date, publisher],
      (err, queryResult) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(queryResult);
      }
    );
  });
};
const editBooks = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update books set ";
    const values = [];
    // {author, title, publisher}
    // logika ini dibuat dengan mengasumsikan ada middleware validasi
    // validasi untuk menghilangkan properti object dari body yang tidak diinginkan
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2}`;
        values.push(body[key], params.id);
        return;
      }
      query += `${key} = $${idx + 1},`;
      values.push(body[key]);
    });
    //   res.json({
    //     query,
    //     values,
    //   });
    postgreDb
      .query(query, values)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
const deleteBooks = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from books where id = $1";
    // OR => logika atau sql
    // "OR" => string OR
    postgreDb.query(query, [params.id], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(result);
    });
  });
};
const transaction = async () => {
  const client = await postgreDb.connect();
  try {
    await client.query("BEGIN"); // start transaction
    // jalankan query yang banyak
    // 1. query insert transaksi, akan mengambil id transaksi
    // 2. query insert multiple untuk pivot transactions_products_sizes
    // await client.query("SAVEPOINT insert_transaction");
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const booksRepo = {
  getBooks,
  createBooks,
  editBooks,
  deleteBooks,
};

module.exports = booksRepo;
