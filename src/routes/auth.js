const authRouter = require("express").Router();

const authController = require("../controllers/auth");

// login
authRouter.post("/", authController.login);
// logout
authRouter.delete("/", (req, res) => {});

module.exports = authRouter;
