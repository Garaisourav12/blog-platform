const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: true,
		methods: "*",
	},
});

// Store the loggedin user's socket id who are connected to this server instance
const userSocketMap = {}; // { userId -> [socketId, ...] }

// Store all loggedin user's userId accross the all server instances
const onlineUsers = {}; // { userId -> count of logged-in instances }

// Helper function to get socketId by userId
const getSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
	const userId = socket.handshake.query.userId;
	if (userId !== undefined) {
		// Handle multiple loggedin
		if (userId in userSocketMap) {
			userSocketMap[userId].push(socket.id);
		} else {
			userSocketMap[userId] = [socket.id];
		}
	}

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		// Don't delete all soceketId
		if (userId in userSocketMap) {
			userSocketMap[userId] = userSocketMap[userId].filter(
				(id) => id !== socket.id
			);
			if (userSocketMap[userId].length === 0) {
				delete userSocketMap[userId];
			}
		}

		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

module.exports = { app, io, server, getSocketId };
