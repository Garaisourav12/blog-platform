const serverEnv = {
	PORT: process.env.PORT,
	MONGO_URI: process.env.MONGO_URI,
	JWT_SECRET: process.env.JWT_SECRET,
	SALT: Number(process.env.SALT),
	NODE_ENV: process.env.NODE_ENV,
};

module.exports = serverEnv;
