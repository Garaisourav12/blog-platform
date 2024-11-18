const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const { NotFoundError, ForbiddenError } = require("../errors");

class CommentService {
	// Create a new comment
	static async addComment({ content, postId, authorId }) {
		const post = await Post.findById(postId);
		if (!post) {
			throw new NotFoundError("Post not found");
		}

		const comment = new Comment({
			content,
			post: postId,
			author: authorId,
		});

		// I have added post hook in comment model to add this comment to the post model

		return await comment.save();
	}

	// Get all comments for a post with pagination and sorting
	static async getComments({ postId, page = 1, limit = 10 }) {
		const post = await Post.findById(postId);
		if (!post) {
			throw new NotFoundError("Post not found");
		}

		const comments = await Comment.find({ post: postId })
			.sort({ createdAt: -1 }) // Sort by latest comments
			.skip((page - 1) * limit)
			.limit(limit)
			.populate("author", "username profilePicture"); // Populate author details

		return comments;
	}

	// Get a single comment by its ID
	static async getCommentById(commentId) {
		const comment = await Comment.findById(commentId)
			.populate("author", "username profilePicture")
			.populate("post", "title"); // Optionally populate post details

		if (!comment) {
			throw new NotFoundError("Comment not found");
		}

		return comment;
	}

	// Delete a comment
	static async deleteComment(commentId, userId) {
		const comment = await Comment.findById(commentId).populate({
			path: "post",
			populate: { path: "author", select: "_id" },
		});
		if (!comment) {
			throw new NotFoundError("Comment not found");
		}

		// Only the author of the comment or the author of the post can delete the comment
		if (
			comment.author.toString() !== userId.toString() &&
			comment.post.author.toString() !== userId.toString()
		) {
			throw new ForbiddenError(
				"You are not authorized to delete this comment"
			);
		}

		await comment.deleteOne();
		return { message: "Comment deleted successfully" };
	}
}

module.exports = CommentService;
