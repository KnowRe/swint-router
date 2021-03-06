'use strict';

var express = require('express'),
	swintHelper = require('swint-helper'),
	defaultize = swintHelper.defaultize,
	walk = swintHelper.walk,
	path = require('path');
const fs = require('fs');

module.exports = function (options) {
	defaultize({
		dir: path.join(path.dirname(require.main.filename), 'router')
	}, options);

	this.options = options;

	this.routeList = null;
	this.expRouter = null;
};

var _ = module.exports.prototype;

_.load = function (middleware) {
	this.middleware = middleware;
	this.initRouter();
	this.setRouter();
};

_.initRouter = function () {
	this.routeList = walk({
		dir: this.options.dir,
		blacklist: function(fullPath) {
			return fullPath.match(/.joi.js$/);
		}
	});
};

_.setRouter = function () {
	var that = this;

	this.expRouter = express.Router();

	this.routeList.forEach(function (filePath) {
		var target = defaultize({
				info: {
					url: '/swint',
					method: 'get'
				},
				preMiddleware: [],
				postMiddleware: [],
				main: function (req, res, next) {
					next();
				}
			}, require(filePath)),
			args = [];

		args.push(target.info.url);

		target.preMiddleware.forEach(function (m) {
			if (typeof m === 'object') {
				args.push(that.middleware[m.name](m.options));
			} else {
				if (that.middleware[m].length === 3) {
					args.push(that.middleware[m]);
				} else if (that.middleware[m].length <= 1) {
					args.push(that.middleware[m]({}));
				}
			}
		});

		const joiFilePath = filePath.replace(/.js$/, '.joi.js');
		if (that.middleware.hasOwnProperty('inputValidator')) {
			if (fs.existsSync(joiFilePath)) {
				args.push(that.middleware['inputValidator'](require(joiFilePath).inputValidator.options));
			}
		}

		args.push(target.main);

		if (that.middleware.hasOwnProperty('outputValidator')) {
			if (fs.existsSync(joiFilePath)) {
				args.push(that.middleware['outputValidator'](require(joiFilePath).outputValidator.options));
			}
		}

		target.postMiddleware.forEach(function (m) {
			if (typeof m === 'object') {
				args.push(that.middleware[m.name](m.options));
			} else {
				if (that.middleware[m].length === 3) {
					args.push(that.middleware[m]);
				} else if (that.middleware[m].length <= 1) {
					args.push(that.middleware[m]({}));
				}
			}
		});

		args.push(function (req, res, next) {
			req.not404 = true;
			next();
		});

		that.expRouter[target.info.method].apply(that.expRouter, args);
	});
};
