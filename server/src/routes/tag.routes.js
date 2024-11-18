const express = require("express");
const TagController = require("../controllers/tag.controller");

const tagRouter = express.Router();

tagRouter.get("/", TagController.getAllTags);

module.exports = tagRouter;
