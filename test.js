
var connect = require('connect'),
	assert = require('assert')
	FsSession = require('./lib/fs-session')(connect);

var store = new FsSession({dir: 'sessions'});
store.set('someSessionId', { cookie: {maxAge: 60}}, function(err, file) {
	if (err) {
		throw err;
	} else {
		console.log(file);
	}

});
store.get('someSessionId', function(err, file) {
	if (err) {
		throw err;
	} else {
		console.log(file);
	}
});
// console.log(store);
// store.destroy('sessss', function(err) {
// 	console.log(err);
// });
// store.purge();

