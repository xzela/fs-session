fs-session
==========

A Node.js module to store connect session data to disk.


## Installation
---

`fs-session` currently relies on the `connect` middleware for storing session data. Future versions hope to remove this dependency.


```
$ npm install fs-session
```  

## Options
---
* `dir` The directory where the session files will be stored. Defaults to `./session`

## Usage
---
To initialize the store:

```
var connect = require('connect'),
	FsSession = require('fs-session')(connect);

var store = new FsSession;

```

The following APIs are exposed to the client:

* `set(sessionId, cookie, callback(err, json))` stores the session data and returns either an `err` and the stored `json` 
* `get(sessionId, callback(err, json))` retrieves the stored data.
* `expired(sessionId, callback(err, boolean))` tests whether a session files has expired
* `destroy(sessionId, callback(err))` destroys a session file
* `list(callback(err, files))` returns a list of all of the sessions
* `clear(callback(err))` removes all of the session files including the directory

## Tests
---
`fs-session` depends on `nodeunit` as its unit testing framework. Some simple tests are already included with this package. Run the following command to run the tests:

```
$ nodeunit test.js
```


## Feeback
---
* Found a bug? 
* Want to improve it? 
* Need to fork it?

Feed back is always welcomed. Submit issues and pull requests to: [https://github.com/xzela/fs-session](https://github.com/xzela/fs-session)

# License
---
MIT

