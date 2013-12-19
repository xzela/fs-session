
var connect = require('connect'),
	assert = require('assert')
	FsSession = require('./lib/fs-session')(connect);

var store = new FsSession({dir: 'sessions'});
// console.log(store);
store.destroy();

