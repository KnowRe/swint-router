const Joi = require('joi');

module.exports = (options = {}) => {
	const validator = new OutputValidator(options);

	return (req, res, next) => {
		validator.validate(req, res, next);
	};
};

class OutputValidator {
	constructor(options) {
		this.output_schema = options.output_schema instanceof Object ? options.output_schema : {};
	}

	validate(req, res, next) {
		const data = req.output.data;

		try {
			this.validator(data);
			req.validation_schema = req.validation_schema || {};
			req.validation_schema.out = this.output_schema;
			next();
		} catch (err) {
			//main route already sent 처리 필요.
			console.log('OUTVAL ERROR OCCUR!!'); //eslint-disable-line
		}
	}

	validator(data) {
		const result = Joi.validate(data, this.output_schema);
		if (result.error !== null) {
			throw result.error.message;
		}
		return result;
	}
}
