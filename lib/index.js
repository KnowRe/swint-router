'use strict';

var express = require('express'),
	swintHelper = require('swint-helper'),
	defaultize = swintHelper.defaultize,
	walk = swintHelper.walk,
	path = require('path');

module.exports = function(options) {
	defaultize({
		dir: path.join(path.dirname(require.main.filename), 'route')
	}, options);
	
	this.options = options;

	this.routeList = null;
	this.expRouter = null;
};

var _ = module.exports.prototype;

_.load = function(middleware) {
	this.middleware = middleware;
	this.initRouter();
	this.setRouter();
};

_.initRouter = function() {
	this.routeList = walk({
		dir: this.options.dir
	});
};

_.setRouter = function() {
	var that = this;

	this.expRouter = express.Router();

	this.routeList.forEach(function(filePath){
		var target = require(filePath),
			args = [];

		args.push(target.info.url);

		target.preMiddleware.forEach(function(t) {
			if(Array.isArray(t)) {
				args.push((that.middleware[t[0]])(t[1]));
			} else {
				args.push(that.middleware[t]);
			}
		});

		args.push(target.main);

		target.postMiddleware.forEach(function(t) {
			if(Array.isArray(t)) {
				args.push((that.middleware[t[0]])(t[1]));
			} else {
				args.push(that.middleware[t]);
			}
		});

		args.push(function(req, res, next) {
			req.not404 = true;
			next();
		});

		that.expRouter[target.info.method].apply(that.expRouter, args);
	});
};
