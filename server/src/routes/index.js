const express = require("express");
const apiRouter = express.Router();

const authRoutes = require("./auth.routes");
const postRoutes = require("./post.routes");
const tagRoutes = require("./tag.routes");

apiRouter.use("/auth", authRoutes);
apiRouter.use("/posts", postRoutes);
apiRouter.use("/tags", tagRoutes);

module.exports = apiRouter;
