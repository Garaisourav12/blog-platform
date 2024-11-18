const { ConflictError, BadRequestError, NotFoundError } = require("../errors");
const User = require("../models/user.model"); // User schema

class AuthService {
	// Register a new user
	static async register({ username, email, password, profilePicture }) {
		// Check if username is already taken
		const isUsernameTaken = await User.findOne({ username });
		if (isUsernameTaken) {
			throw new ConflictError("Username already taken");
		}

		// Check if user already exists
		const isEmailExists = await User.findOne({ email });
		if (isEmailExists) {
			throw new ConflictError("Email already exists");
		}

		// Create and save new user
		return await User.create({
			username,
			email,
			password,
			profilePicture,
		});
	}

	// Login a user
	static async login({ email, password }) {
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			throw new NotFoundError("Invalid email"); // Email Not Found
		}

		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			throw new BadRequestError("Invalid password"); // Wrong Password
		}

		return user.generateToken();
	}

	// Get user profile
	static async getUserProfile(userId) {
		const user = await User.findById(userId).select("-password");
		if (!user) {
			throw new NotFoundError("User not found"); // User Not Found
		}
		return user;
	}
}

module.exports = AuthService;
