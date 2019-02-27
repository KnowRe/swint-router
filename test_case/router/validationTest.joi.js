'use strict';

const Joi = require('joi');

exports.inputValidator = {
	options: {
		input_schema: Joi.object().keys({
			name: Joi.string().required()
		}),
		params_schema: {}
	}
};

exports.outputValidator = {
	options: {
		output_schema: Joi.object().keys({
			hello: Joi.string().required()
		}),
	}
};