const mongoose = require("mongoose");
const validator = require("validator");
const Comment = require("./comment.model");

const PostSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, maxlength: 100 },
		content: { type: String, required: true },
		image: {
			type: String,
			default: null,
			validate: [
				(url) => !url || validator.isURL(url),
				"Invalid image URL",
			],
		},
		tags: [{ type: String, index: true }], // Index for fast tag-based queries
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked the post
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Comments on the post
	},
	{ timestamps: true }
);

// Compound index for efficient sorting and filtering
PostSchema.index({ createdAt: -1, tags: 1 });

// Delete comments when a post is deleted
PostSchema.pre("deleteOne", async function (next) {
	await Comment.deleteMany({ post: this._id });
	next();
});

PostSchema.virtual("commentCount").get(function () {
	return this.comments.length;
});

PostSchema.virtual("likeCount").get(function () {
	return this.likers.length;
});

module.exports = mongoose.model("Post", PostSchema);
