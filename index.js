module.exports = function(connect) {
	return require('./lib/fs-session')(connect);
};
