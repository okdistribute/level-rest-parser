var Models = require('level-orm');
var level = require('level-prebuilt');
var util = require('util');
var bytewise = require('bytewise/hex');

function Level(opts) {
  Models.call(this, { db: opts.db }, opts.name, opts.key);
}
util.inherits(Level, Models);

Level.prototype.post = function (data, cb) {
  Models.prototype.save.call(this, data, cb)
}

Level.prototype.delete = function (key, cb) {
  Models.prototype.del.call(this, key, cb)
}

Level.prototype.put = function (key, data, cb) {
  this.sublevel.put(key, data, function (err) {
    if (err) return cb(err);
    cb(null, key);
  });
}

Level.prototype.all = function (cb) {
  Models.prototype.all.call(this, cb)
}

module.exports = Level