var debug = require('debug')('models');
var Models = require('level-orm');
var level = require('level-prebuilt');
var util = require('util');
var bytewise = require('bytewise/hex');
var QuickRestLevel = require('../..')

module.exports = function(dbPath) {
  var db = level(dbPath,
    {
      keyEncoding: bytewise,
      valueEncoding: 'json'
    }
  );
  var model = new QuickRestLevel(db, 'level', 'owner_id');

  return {
    db: db, // for closing the handler on server shutdown
    level: model
  };
};
