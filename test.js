
var connect = require('connect'),
	assert = require('assert')
	FsSession = require('./lib/fs-session')(connect);

var store = new FsSession({dir: 'sessions'});
// store.set('someSessionId', { cookie: {maxAge: 8987}}, function(err, file) {
// 	console.log(file);
// });
store.get('someSessionId', function(err, file) {
	console.log(err);
});
// console.log(store);
// store.destroy('sessss', function(err) {
// 	console.log(err);
// });
// store.purge();

