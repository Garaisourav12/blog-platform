const express = require("express");
const authController = require("../controllers/auth.controller");
const isAuth = require("../middlewares/isAuth");

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/profile", isAuth, authController.getProfile);
authRouter.post("/logout", authController.logout);

module.exports = authRouter;
