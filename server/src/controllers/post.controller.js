const PostService = require("../services/post.service");
const CommentService = require("../services/comment.service");
const { BadRequestError } = require("../errors");

class PostController {
	// Create a new post
	static async createPost(req, res, next) {
		try {
			const { title, content, image, tags } = req.body;
			const { userId: authorId } = req.user; // Extracted from `isAuth` middleware
			const post = await PostService.createPost({
				title,
				content,
				image,
				tags,
				authorId,
			});
			return res.status(201).json(post);
		} catch (error) {
			next(error);
		}
	}

	// Get all posts with filters and pagination
	static async getPosts(req, res, next) {
		try {
			const { tags, page, limit } = req.query;
			const posts = await PostService.getPosts({
				tags: tags?.split(","), // Convert comma-separated tags to an array otherwise undefined
				page: parseInt(page, 10) || 1,
				limit: parseInt(limit, 10) || 10,
			});
			return res.status(200).json(posts);
		} catch (error) {
			next(error);
		}
	}

	// Get a single post by ID
	static async getPostById(req, res, next) {
		try {
			const { postId } = req.params;
			const post = await PostService.getPostById(postId);
			return res.status(200).json(post);
		} catch (error) {
			next(error);
		}
	}

	// Get posts authored by the logged-in user
	static async getMyPosts(req, res, next) {
		try {
			const { userId } = req.user; // Extracted from `isAuth` middleware
			const { tags, page, limit } = req.query;
			const myPosts = await PostService.getPosts({
				userId,
				tags: tags?.split(","), // Convert comma-separated tags to an array otherwise undefined
				page: parseInt(page, 10) || 1,
				limit: parseInt(limit, 10) || 10,
			});
			return res.status(200).json(myPosts);
		} catch (error) {
			next(error);
		}
	}

	// Add a comment to a post
	static async commentOnPost(req, res, next) {
		try {
			const { postId } = req.params;
			const { content } = req.body;
			const { userId: authorId } = req.user; // Extracted from `isAuth` middleware
			const comment = await CommentService.addComment({
				content,
				postId,
				authorId,
			});
			return res.status(201).json(comment);
		} catch (error) {
			next(error);
		}
	}

	// Delete a comment from a post
	static async deleteComment(req, res, next) {
		try {
			const { commentId } = req.params;
			const { userId } = req.user; // Extracted from `isAuth` middleware
			const result = await CommentService.deleteComment(
				commentId,
				userId
			);
			return res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}

	// Like or unlike a post
	static async likePost(req, res, next) {
		try {
			const { postId } = req.params;
			const { userId } = req.user; // Extracted from `isAuth` middleware
			const result = await PostService.toggleLike(postId, userId);
			return res.status(200).json({
				success: true,
				message: result.message,
				data: {
					likeCount: result.likeCount,
				},
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = PostController;
