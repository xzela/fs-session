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

module.exports = function(connect) {
  // setting up the connect session store;
  var Storage = connect.session.Store;

  function FsStore(options) {
    options = options || {};
    Storage.call(this, options);

    this.client = new events.EventEmitter();
    // localizing
    var self = this;

    self.dir = options.dir || './sessions';

    // checking the session storage directory
    // console.log('checking status of directory: ', self.dir);
    fs.mkdir(path.join(self.dir), function(err){
      if (err) {
        if (err.code != 'EEXIST') {
          throw err;
        } else {
          self.client.emit('connect');
        }
      } else {
        self.client.emit('connect');
      }
    });
  };

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
            return callback(err);
          } else {
            return callback(null, JSON.parse(json));
          }
        }
      });
    } catch(e) {
      if (callback) {
        return callback(e);
      }
    }
  };

  /**
   * Attempts to retreive a session file based on a session id.
   *
   * @param  {String}   sessionId Id or file name of the session in question
   * @param  {Function} callback  callback function (optinal)
   *
   * @api public
   */
  FsStore.prototype.get = function(sessionId, callback) {
    var now = new Date().getTime(),
      self = this,
      json;
    fs.readFile(path.join(this.dir, sessionId + '.json'), 'utf8', function(err, data) {
      if (err) {
        return callback(err);
      } else {
        json = JSON.parse(data);
        return callback(null, json);
      }
    });
  };

  /**
   * Attempts to detect whether a session file is already expired or not
   *
   * @param  {String}   sessionId Id of session you wish to check
   * @param  {Function} callback  callback function (optional)
   *
   * @api public
   */
  FsStore.prototype.expired = function(sessionId, callback) {
    var now = new Date().getTime(),
    self = this,
    expired = false,
    json;
    self.get(sessionId, function(err, data) {
      if (err) {
        return callback(err);
      } else {
        if (data.ttl < now) {
          expired = true;
        }
        return callback(null, expired);
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
    var self = this;
    fs.unlink(path.join(self.dir, sessionId + '.json'), function(err) {
      return callback(err)
    });
  };

  /**
   * Attempts to find all of the session files on disk
   *
   * @param  {Function} callback [description]
   *
   * @api public
   */
  FsStore.prototype.list = function(callback) {
    var self = this;
    fs.readdir(self.dir, function(err, files) {
      if (err) {
        callback(err);
      } else {
        callback(null, files);
      }
    });
  }

  /**
   * Attempts to clear out all of the existing sessions
   *
   * @todo make it so it doesn't blow away the entire folder
   *
   * @param  {Function} callback
   *
   * @api public
   */
  FsStore.prototype.clear = function(callback) {
    var self = this,
        length;
    // first remove all of the files within the session directory
    self.list(function(err, files) {
      length = files.length;
      for(var i = 0; i < files.length; i++) {
        fs.unlink(path.join(self.dir, files[i]), function(err) {
          if (err) callback(err);
        });
      }
      fs.rmdir(path.join(self.dir), function(err) {
        callback(err);
      });
    });
  }

  return FsStore;
};
