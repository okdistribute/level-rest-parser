var level = require('level');
var bytewise = require('bytewise/hex');
var util = require('util');
var debug = require('debug')('models');
var timestamp = require('monotonic-timestamp');

var RestModels = require('..');
var defaults = require('../defaults.js');

// TODO pass in overrides
module.exports = function() {
  var db = level(defaults['DB'],
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

function Person(db) {
  // MetaDat is the metadata for a particular dat instance.
  fields = [
    {
      'name': 'username',
      'type': 'string'
    },
    {
      'name': 'email',
      'type': 'string'
    },
    {
      'name': 'address',
      'type': 'string'
    },
    {
      'name': 'age',
      'type': 'number'
    }
  ];
  var opts = {
    'disabled': true // disables the rest endpoint, defaults to false
  };
  RestModels.call(this, db, 'person', 'username', fields, opts);
}


function MetaDat(db) {
  fields = [
    {
      'name': 'owner_id',
      'type': 'number'
    },
    {
      'name': 'name',
      'type': 'string'
    },
    {
      'name': 'url',
      'type': 'string'
    },
    {
      'name': 'schema',
      'type': 'string',
      'optional': true
    },
    {
      'name': 'license',
      'type': 'string',
      'optional': true
    },
    {
      'name': 'keywords',
      'type': 'array',
      'optional': true,
    }
  ];
  // Call the parent constructor. id is the primary key, but we
  // don't have to define that in the object's schema. It'll be created
  // automagically by level-orm when a keyfn is provided. (see below)
  RestModels.call(this, db, 'metadat', 'id', fields);
}

// make it inherit from RestModels
util.inherits(MetaDat, RestModels);

// id is auto incremented by the unique timestamp.
// could be more sophisticated.
MetaDat.prototype.keyfn = timestamp;
