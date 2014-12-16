var debug = require('debug')('models');

var QuickRestModel = require('../..')
var Simple = require('./simple.js')

module.exports = function(dbPath) {
  var leveldb = require('./leveldb.js')(dbPath)

  var simple = new Simple('owner_id')

  return {
    db: leveldb.db, // for closing the handler on server shutdown
    simple: QuickRestModel(simple),
    level: QuickRestModel(leveldb.Level)
  };
};