const bcrypt = require("bcrypt");
const db = require("../config/postgre");
module.exports = {
  register: (body) => {
    return new Promise((resolve, reject) => {
      const { name, email, password } = body;
      // validasi (email tidak boleh duplikat)
      // 1. cek apakah email di body ada di db
      // 2. kalo ada, maka reject status 400 bad request
      // 3. kalo tidak, lanjut hash
      // Hash Password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        const query =
          "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id";
        const values = [name, email, hashedPassword];
        db.query(query, values, (err, result) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          return resolve(result);
        });
      });
    });
  },
  editPassword: (body) => {
    return new Promise((resolve, reject) => {
      const { old_password, new_password, user_id } = body;
      const getPwdQuery = "SELECT password FROM users WHERE id = $1";
      const getPwdValues = [user_id];
      db.query(getPwdQuery, getPwdValues, (err, response) => {
        if (err) {
          console.log(err);
          return reject({ err });
        }
        const hashedPassword = response.rows[0].password;
        bcrypt.compare(old_password, hashedPassword, (err, isSame) => {
          if (err) {
            console.log(err);
            return reject({ err });
          }
          if (!isSame)
            return reject({
              err: new Error("Old Password is wrong"),
              statusCode: 403,
            });
          bcrypt.hash(new_password, 10, (err, newHashedPassword) => {
            if (err) {
              console.log(err);
              return reject({ err });
            }
            const editPwdQuery = "UPDATE users SET password = $1 WHERE id = $2";
            const editPwdValues = [newHashedPassword, user_id];
            db.query(editPwdQuery, editPwdValues, (err, response) => {
              if (err) {
                console.log(err);
                return reject({ err });
              }
              return resolve(response);
            });
          });
        });
      });
    });
  },
};
