const mongoose = require("mongoose");
const { MONGO_URI } = require("./serverEnv");

const connectDB = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("MongoDB connected successfully");

		const grasefullExit = async () => {
			try {
				await mongoose.connection.close();
				console.log("MongoDB connection closed gracefully");
				process.exit(0);
			} catch (error) {
				console.error(
					`Error during closing mongoDB connection: ${error.message}`
				);
				process.exit(1);
			}
		};

		process.on("SIGINT", grasefullExit); // Ctrl + C
		process.on("SIGTERM", grasefullExit); // On ternination signal
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};

module.exports = connectDB;
