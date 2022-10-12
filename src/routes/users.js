const express = require("express");

const usersRouter = express.Router();

const usersController = require("../controllers/users");

// register / create user
usersRouter.post("/", usersController.register);
// edit password
usersRouter.patch("/account", usersController.editPassword);
// edit profile
usersRouter.patch("/", (req, res) => {});

module.exports = usersRouter;
