const jwt = require("jsonwebtoken");
module.exports = () => {
  return (req, res, next) => {
    const token = req.header("x-access-token");
    if (!token)
      return res
        .status(401)
        .json({ msg: "You have to login first", data: null });

    // verifikasi
    jwt.verify(
      token,
      process.env.SECRET_KEY,
      { issuer: process.env.ISSUER },
      (err, decodedPayload) => {
        if (err) {
          console.log(err);
          return res.status(403).json({ msg: err.message, data: null });
        }
        // payload akan di tempel ke object request
        req.userPayload = decodedPayload;
        next();
      }
    );
  };
};
