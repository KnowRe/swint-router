# swint-router

[![Greenkeeper badge](https://badges.greenkeeper.io/Knowre-Dev/swint-router.svg)](https://greenkeeper.io/)
Routing manager for Swint web server

**Warning: This is not the final draft yet, so do not use this until its official version is launched**

## Installation
```sh
$ npm install --save swint-router
```

## Option
* `dir` : `String`, default: `path.join(path.dirname(require.main.filename), 'router')`

## Usage
```javascript
var myRouter = new swintRouter({
	dir: path.join(__dirname, 'router')
});
myRouter.load(myMiddleware); // An instance of require('swint-middleware').loader({})
```
