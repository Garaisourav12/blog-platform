const mongoose = require("mongoose");
const Post = require("./post.model");

const CommentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
			maxlength: [1000, "Blog content is Too long"],
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

// Index for faster retrieval of comments for a post
CommentSchema.index({ post: 1, createdAt: -1 });

// Hooks to add this comment to the post model
CommentSchema.post("save", async function (comment) {
	await Post.findByIdAndUpdate(comment.post, {
		$push: { comments: comment._id }, // Push the comment ID to the post's comments array
	});
});

// Hooks to remove this comment from the post model
CommentSchema.post("deleteOne", async function (comment) {
	await Post.findByIdAndUpdate(comment.post, {
		$pull: { comments: comment._id }, // Remove the comment ID from the post's comments array
	});
});

module.exports = mongoose.model("Comment", CommentSchema);
