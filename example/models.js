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
    simple: new RestModels(new Simple('owner_id')),
    level: new RestModels(new Level(db))
  };
};


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

function Simple(key) {
  this.db = {}
  this.key = key
}

Simple.prototype.post = function (model, cb) {
  if(!model) {
    return cb('Need values to save')
  }
  var key = model[this.key]
  this.db[key] = model
  return cb(null, key)
}

Simple.prototype.get = function (key, cb){
  if(!key) {
    return cb('Need a key')
  }
  var val = this.db[key]
  if (!val) {
    return cb('NotFound')
  }
  return cb(null, this.db[key])
}

Simple.prototype.put = function (key, model, cb) {
  if(!key) {
    return cb('Need a key')
  }
  this.db[key] = model
  return cb(null, key)
}


Simple.prototype.delete = function (key, cb) {
  if(!key) {
    return cb('Need a key')
  }
  delete this.db[key]
  return cb(null)
}

Simple.prototype.all = function (cb) {
  var values = []
  for (key in this.db) {
    values.push(this.db[key])
  }
  return cb(null, values)
}
