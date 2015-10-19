var assert = require('assert'),
	request = require('request'),
	express = require('express'),
	path = require('path'),
	fs = require('fs'),
	os = require('os'),
	http = require('http'),
	swintMiddleware = require('swint-middleware'),
	swintRouter = require('../lib');

// global.swintVar.printLevel = 5;

describe('Plain router', function() {
	before(function() {
		var app = express(),
			myRouter = new swintRouter({
				dir: path.join(__dirname, '../test_case/router')
			}),
			myMiddleware = new swintMiddleware.loader({
				dir: path.join(__dirname, '../test_case/middleware')
			}),
			server;

		fs.mkdirSync(path.join(os.tmpdir(), 'swint-router'));

		myRouter.load(myMiddleware);

		app.use(myRouter.expRouter);
		server = http.createServer(app);
		server.listen(8080);
	});

	it('test request', function(done) {
		request.get({
			url: 'http://localhost:8080/test_case'
		}, function(err, resp, body) {
			assert.equal(resp.headers['x-pre-middleware1'], 'middleware1');
			assert.equal(resp.headers['x-pre-middleware2'], 'middlewareOptionString');
			assert.equal(
				fs.readFileSync(path.join(os.tmpdir(), 'swint-router/post-middleware.txt'), 'utf-8'),
				'test'
			);
			done();
		});
	});

	after(function() {
		fs.unlinkSync(path.join(os.tmpdir(), 'swint-router/post-middleware.txt'));
		fs.rmdirSync(path.join(os.tmpdir(), 'swint-router'));
	});
});
