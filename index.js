var Models = require('level-orm');
var level = require('level-prebuilt');
var util = require('util');
var bytewise = require('bytewise/hex');

function QuickRestLevel(db, field, key) {
  Models.call(this, { db: db }, field, key);
}
util.inherits(QuickRestLevel, Models);

QuickRestLevel.prototype.post = function (model, cb) {
  Models.prototype.save.call(this, model, cb)
}

QuickRestLevel.prototype.delete = function (model, cb) {
  Models.prototype.del.call(this, model, cb)
}

QuickRestLevel.prototype.put = function (key, model, cb) {
  this.sublevel.put(key, model, function (err) {
    if (err) return cb(err);
    cb(null, key);
  });
}

module.exports = QuickRestLevel