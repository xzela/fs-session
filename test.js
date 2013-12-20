
var connect = require('connect'),
	assert = require('assert')
	FsSession = require('./lib/fs-session')(connect);

var store = new FsSession,
	session_id = 'session_id',
	cookie = {cookie: {
		maxAge: 60
	}};

var onDestroy = function(err, callback) {
	console.log('verifying destroying session: ' + session_id);
	assert(!err, '#destroy failed to destroy session');
};

store.set(session_id, cookie, function(err, data) {
	var sess = data;
	// console.log('verifying setting session: ' + session_id);
	assert(!err, '#set() session failed to serialize');
	store.expired(session_id, function(err, expired) {
		assert.equal(expired, false, "#expired session should not be expired already expired");
	});
	// store.destroy(session_id, onDestroy);
});


// store.set('someSessionId', { cookie: {maxAge: 60}}, function(err, file) {
// 	if (err) {
// 		throw err;
// 	} else {
// 		console.log(file);
// 	}

// });
// store.get('someSessionId', function(err, file) {
// 	if (err) {
// 		throw err;
// 	} else {
// 		console.log(file);
// 	}
// });
// console.log(store);
// store.destroy('someSessionId', function(err) {
// 	console.log(err);
// });
// store.purge();

