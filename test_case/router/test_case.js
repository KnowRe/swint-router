'use strict';

exports.info = {
	url: '/test_case',
	method: 'get'
};

exports.preMiddleware = [
	'pre-middleware1',
	[
		'pre-middleware2',
		{
			string: 'middlewareOptionString'
		}
	]
];

exports.postMiddleware = [
	'post-middleware'
];

exports.main = function(req, res, next) {
	res.send('');
	next();
};
