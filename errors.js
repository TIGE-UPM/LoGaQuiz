class CustomError extends Error {
	constructor(message, code, httpStatus) {
		super(message);
		this.errObject = { message, code };
		this.httpStatus = httpStatus;
	}
}

module.exports.CustomError = CustomError;

function CustomErrorHandler(err, req, res, next) {
	if (err instanceof CustomError) {
		return res.status(err.httpStatus).send(err.errObject);
	}
	next(err);
}

function ParserErrorHandler(err, req, res, next) {
	if (err.type === 'entity.parse.failed') {
		return res.status(400).send({
			message: "Invalid JSON object in the request's body",
			code: 'invalid_json_body',
		});
	}
	next(err);
}

// eslint-disable-next-line no-unused-vars
function GlobalErrorHandler(err, req, res, next) {
	console.error(err);
	return res.status(500).send({
		message: 'Internal server error',
		code: 'internal_server_error',
	});
}

module.exports.handleErrors = (app) => {
	app.use(CustomErrorHandler);
	app.use(ParserErrorHandler);
	app.use(GlobalErrorHandler);
};
