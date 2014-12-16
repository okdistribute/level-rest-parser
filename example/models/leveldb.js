var Models = require('level-orm');
var level = require('level-prebuilt');
var util = require('util');
var bytewise = require('bytewise/hex');
var Level = require('../../')

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
