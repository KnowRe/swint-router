'use strict';

exports.info = {
	url: '/validationTest',
	method: 'get'
};

exports.preMiddleware = [];

exports.postMiddleware = [];

exports.main = function (req, res, next) {
	req.output = {};
	req.output.data = {hello: 'world'};
	res.status(200).json(req.output);
	next();
};
