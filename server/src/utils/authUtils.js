const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../configs/serverEnv");

const generateToken = (payload) => {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: "1d",
	});
};

const verifyToken = (token) => {
	return jwt.verify(token, JWT_SECRET);
};

const hashPassword = async (password) => {
	return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hash) => {
	return await bcrypt.compare(password, hash);
};

module.exports = {
	generateToken,
	verifyToken,
	hashPassword,
	comparePassword,
};
