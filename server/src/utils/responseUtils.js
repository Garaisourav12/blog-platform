const sendErrorResponse = (res, error) => {
	return res.status(error?.statusCode || 500).json({
		success: false,
		message: isHttpError(error) ? error.message : "Internal Server Error",
	});
};

module.exports = { sendErrorResponse };
