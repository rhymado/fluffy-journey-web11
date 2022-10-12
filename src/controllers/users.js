const usersRepo = require("../repo/users");
module.exports = {
  register: (req, res) => {
    const { body } = req;
    usersRepo
      .register(body)
      .then((response) => {
        res.status(201).json({
          msg: "Register Success",
          data: {
            ...response.rows[0],
            email: body.email,
            name: body.name,
          },
        });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ msg: "Internal Server Error", error: err.message });
      });
  },
  editPassword: (req, res) => {
    const { body } = req;
    usersRepo
      .editPassword(body)
      .then((response) => {
        res.status(200).json({
          msg: "Password has been changed",
          data: null,
        });
      })
      .catch((objErr) => {
        const statusCode = objErr.statusCode || 500;
        res.status(statusCode).json({ msg: objErr.err.message });
      });
  },
};
