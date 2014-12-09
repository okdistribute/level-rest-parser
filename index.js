var jsonBody = require("body/json");
var Models = require('level-orm');
var util = require('util');
var url = require('url')
var debug = require('debug')('rest');
var Secondary = require('level-secondary');
var through = require('through')

module.exports = RestModels;

function RestModels(db, name, key, fields, opts) {
  this.fields = fields;
  this.disabled = opts && opts.disabled || false;
  Models.call(this, { db: db }, name, key);
  this.indexes = createIndexes(this[this.name], this.fields)
}
util.inherits(RestModels, Models);

function createIndexes(db, fields) {
  var res = {}

  var field;
  for (i in fields) {
    field = fields[i]
    // TODO: allow for a custom index within a subobject
    if (field.index) {
      res[field.name] = Secondary(db, field.name)
    }
  }
  return res
}

RestModels.prototype.dispatch = function (req, res, id, cb) {
  var self = this
  if (self.disabled) return cb('this model has rest endpoint disabled', false);
  var method = req.method.toLowerCase();
  switch (method) {
    case 'post':
      self.postHandler(req, res, cb);
      break;
    default:
      self[method + "Handler"](req, res, id, cb);
      break;
  }
};

function fieldValid(field, incField) {
  if (!field.optional && !incField) {
    debug('field not optional or incField is empty', !field.optional, !incField);
    return false;
  }
  return field.type === typeof incField || incField === undefined;
}

RestModels.prototype.getBodyData = function (req, res, cb) {
  var self = this;
  var data = {};
  jsonBody(req, res, function (err, body) {
    if (err || !body) {
      return cb(err);
    }
    debug('request data\n', body);

    var field, incField;
    for (i in self.fields) {
      field = self.fields[i];
      incField = body[field.name];

      if (!fieldValid(field, incField)) {
        debug('not validating request', field, incField, body);
        cb(new Error('Field ' + field.name + ' required.'))
      }
      else {
        data[field.name] = body[field.name];
      }
    }
    cb(null, data);
  });
};

RestModels.prototype.postHandler = function (req, res, cb) {
  var self = this;
  self.getBodyData(req, res, function(err, data) {
    if (err || !data) {
      return cb(err)
    }
    debug('posting ', self.name, self.key, data, typeof data);
    Models.prototype.save.call(self, data, function (err, id) {
      if (err) return cb(err)
      res.statusCode = 201;
      data[self.key] = id;
      res.end(JSON.stringify(data));
    });
  });
};

RestModels.prototype.putHandler = function (req, res, id, cb) {
  var self = this;
  if (!id) return cb('need an id to put', false);

  self.getBodyData(req, res, function (err, data) {
    if (err || !data) {
      return cb(err)
    }
    debug('putting ', self.name, self.key, data);
    data[self.key] = id;
    Models.prototype.save.call(self, data, function (err) {
      if (err) return cb(err)
      res.statusCode = 200;
      res.end(JSON.stringify(data));
    });
  });
};

RestModels.prototype.deleteHandler = function (req, res, id, cb) {
  if (!id) return cb('need an id to delete', false);

  debug('deleting ', this.name, this.key, id);
  Models.prototype.del.call(this, id, function (err) {
    if (err) return cb(err)
    res.statusCode = 200;
    res.end();
  });
};

RestModels.prototype.getHandler = function (req, res, id, cb) {
  var self = this
  if (!id) {
    // get by url query parameters
    var qs = url.parse(req.url, true).query

    if (Object.keys(qs).length > 0) {
      debug('looking up qs', qs)

      for (var key in qs) {
        if (qs.hasOwnProperty(key) && self.indexes.hasOwnProperty(key)) {
          var index = self.indexes[key]
          var lookup = qs[key]

          // TODO: you can only filter by one field right now,
          // we need to chain the streams together.
          index.get(lookup, function (err, model) {
            if (err) {
              if (err.name == 'NotFoundError') {
                res.statusCode == 500
                res.end()
                return
              }
              return cb(err)
            }
            res.statusCode = 200;
            res.end(JSON.stringify(model));
            return cb(null)
          })
        }
        else {
          return cb(new Error('need to make an index for that first'))
        }
      }
    }
    else {
      // no filtering
      console.log('all')
      Models.prototype.all.call(this, function (err, data) {
        if (err) return cb(err)
        res.statusCode = 200;
        res.end(JSON.stringify(data));
      });
    }
  }
  else {
    // get by ID
    Models.prototype.get.call(this, id, function (err, data) {
      if (err) {
        if (err.name === 'NotFoundError') {
          res.statusCode = 204;
          res.end();
        }
        else {
          return cb(err)
        }
      }
      res.statusCode = 200;
      res.end(JSON.stringify(data));
    });
  }
};

