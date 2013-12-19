
var fs = require('fs'),
	path = require('path'),
	events = require('events');

module.exports = function(connect) {
	// setting up the connect session store;
	var Storage = connect.session.Store;

	function FsStore(options) {
		options = options || {};
		Storage.call(this, options);

		this.client = new events.EventEmitter();
		var self = this;

		this.dir = options.dir || './sessions';
		// checking the session storage directory
		fs.stat(this.dir, function(err, stats) {
			if (err && err.errno == 34) {
				// console.log(err);
				fs.mkdir(path.join(this.dir), function(err) {
					// console.log(err);
					console.log('directory created');
				});
			} else if (err && (err.errno != 34)) {
				// console.log(err);
				throw err;
			} else {
				// console.log(stats);
			}
		});
	}


	/**
	 * Attempts to unlink a given session by its id
	 *
	 * @param  String   sessionId   Files are serialized to disk by the sessionId
	 * @param  Function callback    A callback (optional)
	 *
	 * @return {[type]}             [description]
	 */
	FsStore.prototype.destroy = function(sessionId, callback) {
		fs.unlink(path.join(this.dir, sessionId + '.json'), function(err) {
			if (err) {
				throw err;
			}
			if (callback !== undefined) {
				callback();
			}
		});
	};

	return FsStore;
};
