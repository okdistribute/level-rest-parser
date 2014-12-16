var Models = require('level-orm');
var level = require('level-prebuilt');
var util = require('util');
var bytewise = require('bytewise/hex');

function LevelQuickRest(opts) {
  Models.call(this, { db: opts.db }, opts.name, opts.key);
}
util.inherits(LevelQuickRest, Models);

LevelQuickRest.prototype.post = function (data, cb) {
  Models.prototype.save.call(this, data, cb)
}

LevelQuickRest.prototype.delete = function (key, cb) {
  Models.prototype.del.call(this, key, cb)
}

LevelQuickRest.prototype.put = function (key, data, cb) {
  this.sublevel.put(key, data, function (err) {
    if (err) return cb(err);
    cb(null, key);
  });
}

LevelQuickRest.prototype.all = function (cb) {
  Models.prototype.all.call(this, cb)
}

module.exports = LevelQuickRest