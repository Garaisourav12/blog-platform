const { UnauthorizedError } = require("../errors");
const { verifyToken } = require("../utils/authUtils");

const isAuth = (req, res, next) => {
	const token = req?.cookies?.token;

	try {
		if (!token) {
			throw new UnauthorizedError("Token not found");
		}

		const user = verifyToken(token);

		if (!user) {
			throw new UnauthorizedError("Invalid token");
		}

		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = isAuth;
