const AuthService = require("../services/auth.service");
const { BadRequestError } = require("../errors");
const { NODE_ENV } = require("../configs/serverEnv");

class AuthController {
	// Register a new user
	static async register(req, res, next) {
		try {
			const { username, email, password, profilePicture } = req.body;

			if (!username || !email || !password) {
				throw new BadRequestError(
					"Username, email, and password are required"
				);
			}

			const user = await AuthService.register({
				username,
				email,
				password,
				profilePicture,
			});

			res.status(201).json({
				success: true,
				message: "User registered successfully",
				data: {
					id: user._id,
					username: user.username,
					email: user.email,
					profilePicture: user.profilePicture,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	// Login a user
	static async login(req, res, next) {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				throw new BadRequestError("Email and password are required");
			}

			const token = await AuthService.login({ email, password });

			// Send token as an HTTP-only cookie along with the response
			return res
				.status(200)
				.cookie("token", token, {
					expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
					httpOnly: true,
					secure: NODE_ENV !== "development",
					sameSite: NODE_ENV !== "development" ? "none" : "strict",
				})
				.json({
					success: true,
					message: "User logged in successfully",
				});
		} catch (error) {
			next(error);
		}
	}

	// Get user profile
	static async getProfile(req, res, next) {
		try {
			const { userId } = req.user; // Extracted from `isAuth` middleware already

			const user = await AuthService.getUserProfile(userId);

			res.status(200).json({
				success: true,
				message: "User profile retrieved successfully",
				data: user,
			});
		} catch (error) {
			next(error);
		}
	}

	// Logout a user
	static async logout(req, res, next) {
		try {
			res.clearCookie("token", {
				httpOnly: true,
				secure: NODE_ENV !== "development",
				sameSite: NODE_ENV !== "development" ? "none" : "strict",
			});

			return res.status(200).json({
				success: true,
				message: "User logged out successfully",
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = AuthController;
