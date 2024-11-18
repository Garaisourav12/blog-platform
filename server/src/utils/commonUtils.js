const { HttpError } = require("../errors");

const isHttpError = (error) => {
	return error instanceof HttpError;
};

module.exports = { isHttpError };
