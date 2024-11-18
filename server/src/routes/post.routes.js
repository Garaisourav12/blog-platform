const express = require("express");
const postRouter = express.Router();
const PostController = require("../controllers/post.controller");
const isAuth = require("../middlewares/isAuth");

postRouter.post("/", isAuth, PostController.createPost); // Create a post
postRouter.get("/", PostController.getPosts); // Get all posts
postRouter.get("/my-posts", isAuth, PostController.getMyPosts); // Get logged-in user's posts
postRouter.get("/:postId", PostController.getPostById); // Get a post by ID
postRouter.post("/:postId/comment", isAuth, PostController.commentOnPost); // Comment on a post
postRouter.delete("/comment/:commentId", isAuth, PostController.deleteComment); // Delete a comment
postRouter.post("/:postId/like", isAuth, PostController.likePost); // Like/unlike a post

module.exports = postRouter;
