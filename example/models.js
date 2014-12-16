var level = require('level-prebuilt');
var Models = require('level-orm');
var bytewise = require('bytewise/hex');
var util = require('util');
var debug = require('debug')('models');
var timestamp = require('monotonic-timestamp');

var config = require('./config.js');
var RestModels = require('..')


// TODO pass in overrides
module.exports = function(dbPath) {

  var db = level(dbPath,
    {
      keyEncoding: bytewise,
      valueEncoding: 'json'
    }
  );

  return {
    db: db, // for closing the handler on server shutdown
    metadat: new RestModels(new Metadat(db))
  };
};


function Metadat(db) {
  Models.call(this, { db: db }, 'users', 'id');
}
util.inherits(Metadat, Models);

Metadat.prototype.post = function (model, cb) {
  Models.prototype.save.call(this, model, cb)
}

Metadat.prototype.delete = function (model, cb) {
  Models.prototype.del.call(this, model, cb)
}

Metadat.prototype.put = function (key, model, cb) {
  this.sublevel.put(key, model, function (err) {
    if (err) return cb(err);
    cb(null, key);
  });
}

Metadat.prototype.keyfn = timestamp;
