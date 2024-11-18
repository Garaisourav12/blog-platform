const Post = require("../models/post.model");
const User = require("../models/user.model");
const { NotFoundError, BadRequestError, ForbiddenError } = require("../errors");

class PostService {
	// Create a new post
	static async createPost({ title, content, image, tags, authorId }) {
		return await Post.create({
			title,
			content,
			image,
			tags,
			author: authorId,
		});
	}

	// Get all posts with filters and pagination
	static async getPosts({ userId, tags, page = 1, limit = 10 }) {
		const query = {};

		if (authorId) query.author = userId; // For Fetching My Posts

		if (tags) query.tags = { $in: tags };

		return await Post.find(query)
			.sort({ createdAt: -1 }) // Latest posts first
			.skip((page - 1) * limit)
			.limit(limit)
			.populate("author", "username profilePicture"); // Populate author details
	}

	// Get a single post by ID and populate comments and likes
	static async getPostById(postId) {
		const post = await Post.findById(postId)
			.populate("author", "username profilePicture") // Populate author details
			.populate({
				path: "comments",
				populate: { path: "author", select: "username profilePicture" },
			})
			.populate("likes", "username profilePicture"); // Populate users who liked the post

		if (!post) throw new NotFoundError("Post not found");
		return post;
	}

	// Like or unlike a post
	static async toggleLike(postId, userId) {
		const post = await Post.findById(postId);
		if (!post) throw new NotFoundError("Post not found");

		const isLiked = post.likes.includes(userId);
		if (isLiked) {
			post.likes = post.likes.filter(
				(id) => id.toString() !== userId.toString()
			);
		} else {
			post.likes.push(userId);
		}
		await post.save();

		return {
			likeCount: post.likes.length,
			message: `${isLiked ? "Unliked" : "Liked"} the post successfully`,
		};
	}

	// Update a post
	static async updatePost(postId, { userId, title, content, image, tags }) {
		const post = await Post.findById(postId);

		if (!post) throw new NotFoundError("Post not found");

		if (post.author.toString() !== userId.toString()) {
			throw new ForbiddenError(
				"You are not authorized to update this post"
			);
		}

		post.title = title;
		post.content = content;
		post.image = image;
		post.tags = tags;

		await post.save();
		return post;
	}

	// Delete a post
	static async deletePost(postId, userId) {
		const post = await Post.findById(postId);
		if (!post) throw new NotFoundError("Post not found");

		if (post.author.toString() !== userId.toString()) {
			throw new ForbiddenError(
				"You are not authorized to delete this post"
			);
		}

		await post.deleteOne();
		return { message: "Post deleted successfully" };
	}
}

module.exports = PostService;
