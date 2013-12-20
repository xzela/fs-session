/*
 * fs-session - Store the session data on the file system
 * Copyright(c) 2014 xzela <zeph@lafassett.com>
 * Apache Licensed v2
 * url: https://github.com/xzela/fs-session
 */

var fs = require('fs'),
  path = require('path'),
  events = require('events');

var ENOENT = 34,
  ONEDAY = 86400;

function SessionError(msg) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.message = msg;
  this.errno = ENOENT;
  this.code = 'ENOENT';
  this.name = 'SessionError';
}


module.exports = function(connect) {
  // setting up the connect session store;
  var Storage = connect.session.Store;
  var sessionError = new SessionError;

  function FsStore(options) {
    options = options || {};
    Storage.call(this, options);

    this.client = new events.EventEmitter();
    // localize
    var self = this;

    self.dir = options.dir || './sessions';
    self.destroy = this.destroy;

    console.log(self.dir);
    // checking the session storage directory
    fs.stat(this.dir, function(err, stats) {
      if (err && err.errno == ENOENT) {
        fs.mkdir(path.join(self.dir), function(err) {
          self.client.emit('connect');
        });
      } else if (err && (err.errno != ENOENT)) {
        throw err;
      } else {
        self.client.emit('connect');
      }
    });
  }

  /**
   * Allow FsStore to inherit the Storage
   */
  FsStore.prototype.__proto__ = Storage.prototype;

  /**
   * Attempts to set (write to disk) a session file
   *
   * @param {String}   id       [description]
   * @param {Object}   session  [description]
   * @param {Function} callback [description]
   *
   * @api public
   */
  FsStore.prototype.set = function(id, session, callback) {
    try {
      var maxAge = session.cookie.maxAge,
        now = new Date().getTime(),
        ttl = maxAge ? now + maxAge : now + ONEDAY,
        json = session;
        json['ttl'] = ttl;
        json = JSON.stringify(json);
      fs.writeFile(path.join(this.dir, id + '.json'), json, function(err) {
        if(callback) {
          if (err) {
            callback(err);
          } else {
            callback(null, json);
          }
        }
      });
    } catch(e) {
      if (callback) {
        callback(e);
      }
    }
  };

  /**
   * [get description]
   *
   * @param  {String}   sessionId [description]
   * @param  {Function} callback  [description]
   *
   * @api public
   */
  FsStore.prototype.get = function(sessionId, callback) {
    var now = new Date().getTime(),
      self = this,
      json;
    fs.readFile(path.join(this.dir, sessionId + '.json'), function(err, data) {
      if (err) {
        callback(err);
      } else {
        json = JSON.parse(data);
        if (json.ttl < now) {
          self.destroy(sessionId, callback(err));
        } else {
          return callback(null, data)
        }
      }
    });
  };

  /**
   * Attempts to unlink a given session by its id
   *
   * @param  {String}   sessionId   Files are serialized to disk by their
   *                                sessionId
   * @param  {Function} callback    A callback (optional)
   *
   * @api public
   */
  FsStore.prototype.destroy = function(sessionId, callback) {
    fs.unlink(path.join(this.dir, sessionId + '.json'), function(err) {
      callback(err)
    });
  };

  /**
   * [clear description]
   *
   * @param  {Function} callback
   *
   * @api public
   */
  FsStore.prototype.clear = function(callback) {
    fs.rmdir(path.join(this.dir), function(err) {
      callback(err);
    });
  }

  return FsStore;
};
