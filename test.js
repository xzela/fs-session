
var connect = require('connect'),
	assert = require('assert')
	FsSession = require('./lib/fs-session')(connect);

var store = new FsSession;
var _sses;

exports.groupOne = {
	setUp: function (callback) {
		this._sid = 'sid';
		this._cookie = {
			cookie: {
				maxAge: 60
			}
		};
		callback();
	},
	setSession: function(test) {
		test.expect(1);
		store.set(this._sid, this._cookie, function(err, data) {
			test.ok(!err, '#setSession: Session failed to serialize to disk because: ');
			this._sess = data;
			test.done();
		});

	},
	expireSession: function(test) {
		test.expect(1);
		store.expired(this._sid, function(err, expired) {
			test.equal(expired, false, "#expireSession: Session should not be already expired");
			test.done();
		});
	},
	getSession: function(test) {
		test.expect(3);
		store.get(this._sid, function(err, data) {
			test.ok(!err, "#getSession: Failed to get session");
			test.equal(this._sess.ttl, data.ttl, "#getSession: Session ttl should be the same!");
			test.equal(this._sess.maxAge, data.maxAge, "#getSession: Session maxAge should be the same!");
			test.done();
		});
	},
	destroySession: function(test) {
		test.expect(1);
		store.destroy(this._sid, function(err, callback) {
			test.ok(!err, '#destroy failed to destroy session');
			test.done();
		});
	}
};

exports.groupTwo = {
	setUp: function(callback) {
		this._sid = 'sid2';
		this._cookie = {
			cookie: {
				maxAge: 10
			}
		};
		callback();
	},
	setSession: function(test) {
		test.expect(1);
		store.set(this._sid, this._cookie, function(err, data) {
			test.ok(!err, '#setSession: Session failed to serialize to disk because: ');
			_sess = data;
			test.done();
		});
	},
	getSession: function(test) {
		test.expect(1);
		test.ok(this._sid);
		test.done();
	},
	expireSession: function(test) {
		var self = this;
		test.expect(1);
		setTimeout(function() {
			store.expired(self._sid, function(err, expired) {
				test.equal(expired, true, "#expired() session should be expired");
				test.done();
			});
		}, 1000);
	}
};
