const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// File Imports
const { server, app } = require("./socket");
const apiRoutes = require("./routes");
const connectDB = require("./configs/db");
const { PORT } = require("./configs/serverEnv");
const { sendErrorResponse } = require("./utils/responseUtils");

// Constants
const port = PORT || 8000;
const corsOptions = {
	origin: true,
	method: "*",
	credentials: true,
};

// Server Initialization
(async () => {
	// Middlewares
	app.use(cors(corsOptions));
	app.use(cookieParser());
	app.use(express.json());

	// Entry Point
	app.get("/", (req, res) => {
		return res.status(200).json({
			message: "Blog service is up and running",
			version: "1.0.0",
		});
	});

	// Routes
	app.use("/api", apiRoutes);

	// Handle Errors
	app.use((error, req, res, next) => {
		return sendErrorResponse(res, error);
	});

	// Unknown Routes
	app.use((req, res) => {
		return res.status(404).json({
			message: `Cannot ${req.method} ${req.path}`,
			error: "Not found",
		});
	});

	// Database Connection
	await connectDB();

	// Start Server
	server.listen(port, () => {
		console.log(`Server is running on port ${port}`);
		console.log(`http://localhost:${port}`);
	});
})();
