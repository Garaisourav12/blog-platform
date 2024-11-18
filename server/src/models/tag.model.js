const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			index: true,
			trim: true,
		}, // Unique tag name
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tag", tagSchema);
