
var connect = require('connect'),
	assert = require('assert')
	FsSession = require('./lib/fs-session')(connect);

var store = new FsSession,
	session_id = 'session_id',
	session_id2 = 'session_id2',
	cookie = {cookie: {
		maxAge: 60
	}};

exports.sessionTestOne = function(test) {
	store.set(session_id, cookie, function(err, data) {
		var sess = data;
		// console.log('verifying setting session: ' + session_id);
		test.ok(!err, '#set() session failed to serialize');
		store.expired(session_id, function(err, expired) {
			test.equal(expired, false, "#expired session should not be expired already expired");
		});
		store.get(session_id, function(err, data) {
			test.equal(sess.ttl, data.ttl, "#get session ttl should be the same!");
			test.equal(sess.cookie.maxAge, data.cookie.maxAge, "#get session cookie.maxAge should be the same!");
		});
		store.destroy(session_id, function(err, callback) {
			console.log('verifying destroying session: ' + session_id);
			assert(!err, '#destroy failed to destroy session');
			test.done();
		});
	});

};

exports.sessionTestTwo = function(test) {
	store.set(session_id2, {cookie: {maxAge:10}}, function(err, data) {
		setTimeout(function() {
			store.expired(session_id2, function(err, expired) {
				test.equal(expired, true, "#expired() session should be expiored");
				test.done();
			});
		}, 5000);
	});
};
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

