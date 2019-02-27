const Joi = require('joi');

module.exports = (options = {}) => {
	const validator = new InputValidator(options);
	return function (req, res, next) {
		validator.validate(req, res, next);
	};
};

class InputValidator {
	constructor(options) {
		this.input_schema = options.input_schema instanceof Object ? options.input_schema : {};
		this.params_schema = options.params_schema instanceof Object ? options.params_schema : {};
	}

	validate(req, res, next) {
		try {
			this.validator(req);
			req.validation_schema = {
				input: this.input_schema
			};
			next();
		} catch (err) {
			res.status(400).json({ERROR: err});
		}
	}

	validator(req) {
		req.input = JSON.parse(req.query['input']);
		let result = Joi.validate(req.input, this.input_schema);
		if (result.error !== null) {
			throw result.error.message;
		}
		result = Joi.validate(req.params, this.params_schema);
		if (result.error !== null) {
			throw result.error.message;
		}
	}
}