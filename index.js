var Models = require('level-orm');
var level = require('level-prebuilt');
var util = require('util');
var bytewise = require('bytewise/hex');

function LevelQuickRest(db, field, key) {
  Models.call(this, { db: db }, field, key);
}
util.inherits(LevelQuickRest, Models);

LevelQuickRest.prototype.post = function (model, cb) {
  Models.prototype.save.call(this, model, cb)
}

LevelQuickRest.prototype.delete = function (model, cb) {
  Models.prototype.del.call(this, model, cb)
}

LevelQuickRest.prototype.put = function (key, model, cb) {
  this.sublevel.put(key, model, function (err) {
    if (err) return cb(err);
    cb(null, key);
  });
}

LevelQuickRest.prototype.all = function (cb) {
  Models.prototype.all.call(this, cb)
}

module.exports = LevelQuickRest