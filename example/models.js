var level = require('level-prebuilt');
var bytewise = require('bytewise/hex');
var util = require('util');
var debug = require('debug')('models');
var timestamp = require('monotonic-timestamp');

var RestModels = require('..');
var config = require('./config.js');

// TODO pass in overrides
module.exports = function(dbPath) {

  var db = level(dbPath,
    {
      keyEncoding: bytewise,
      valueEncoding: 'json'
    }
  );

  return {
    db: db,
    person: new Person(db),
    metadat: new MetaDat(db)
  };
};


function MetaDat(db) {
  // Call the parent constructor. id is the primary key, but we
  // don't have to define that in the object's schema. It'll be created
  // automagically by level-orm when a keyfn is provided. (see below)
}
new RestModels.call(this,);

// make it inherit from RestModels
util.inherits(MetaDat, RestModels);

// id is auto incremented by the unique timestamp.
// could be more sophisticated.
MetaDat.prototype.keyfn = timestamp;
