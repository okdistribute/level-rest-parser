var Models = require('level-orm');
var level = require('level-prebuilt');
var util = require('util');
var bytewise = require('bytewise/hex');

module.exports = function (dbPath) {

  var db = level(dbPath,
    {
      keyEncoding: bytewise,
      valueEncoding: 'json'
    }
  );

  return {
    db: db,
    Level: new Level(db)
  }
}

function Level(db) {
  Models.call(this, { db: db }, 'level', 'owner_id');
}
util.inherits(Level, Models);

Level.prototype.post = function (model, cb) {
  Models.prototype.save.call(this, model, cb)
}

Level.prototype.delete = function (model, cb) {
  Models.prototype.del.call(this, model, cb)
}

Level.prototype.put = function (key, model, cb) {
  this.sublevel.put(key, model, function (err) {
    if (err) return cb(err);
    cb(null, key);
  });
}

