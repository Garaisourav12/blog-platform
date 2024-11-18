const mongoose = require("mongoose");
const validator = require("validator");
const {
	hashPassword,
	comparePassword,
	verifyToken,
} = require("../utils/authUtils");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "Username is required"],
			unique: true,
			trim: true,
			minlength: [2, "Username must be at least 2 characters"],
			maxlength: [20, "Username must be at most 20 characters"],
			validate: [
				validator.isAlphanumeric,
				"Username can only contain letters and numbers",
			], // Only allows letters and numbers no whitespace and other special characters
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, "Please provide a valid email"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters"],
			select: false, // Ensures password is not sent in queries
		},
		profilePicture: {
			type: String,
			default: null,
			validate: [
				(url) => !url || validator.isURL(url),
				"Please provide a valid URL",
			],
		},
	},
	{ timestamps: true }
);

// Indexing
userSchema.index({ email: 1 });

// Password Hashing (Pre-save Hook)
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await hashPassword(this.password);
	next();
});

// Instance Method: Password Comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await comparePassword(candidatePassword, this.password);
};

// Instance Method: Generate Token
userSchema.methods.generateToken = function () {
	return verifyToken({ userId: this._id });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
