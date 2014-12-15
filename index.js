var jsonBody = require('body/json');
var url = require('url')
var debug = require('debug')('restful');

module.exports = RestModels;

function RestModels(model, opts) {
  /*
  Parameters
  ------
  model : object
  the model object should have the following methods:
  .put(id, data, function (err, data))
   -- data to be updated by id
  .get(id, function (err, data))
  .query(params, function (err, data))
   -- params a dictionary of field: value for filtering the db
   -- returns all matching rows
  .all(function (err, data))
   -- returns all data
  .post(data, function (err, data))
   -- data is the post parameters in the request
   -- returns the given row with id value

  opts : object
  available options:
   -- disabled (boolean) to expose the rest api or not
  */


  this.disabled = opts && opts.disabled || false;
  this.model = model
}

RestModels.prototype.dispatch = function (req, res, id, cb) {
  var self = this
  if (self.disabled) return cb('this model has rest endpoint disabled');
  var method = req.method.toLowerCase();
  switch (method) {
    case 'post':
      self.postHandler(req, res, cb);
      break;
    case 'get':
      self.getHandler(req, res, id, cb);
      break;
    case 'put':
      self.putHandler(req, res, id, cb);
      break;
    case 'delete':
      self.deleteHandler(req, res, id, cb);
      break;
    default:
      cb('method must be one of post put get or delete')
      break;
  }
}

RestModels.prototype.getBodyData = function (req, res, cb) {
  var self = this;
  var data = {};
  jsonBody(req, res, function (err, body) {
    if (err || !body) {
      return cb(err);
    }
    debug('request data\n', body);
    cb(null, data);
  });
}

RestModels.prototype.postHandler = function (req, res, cb) {
  var self = this;
  self.getBodyData(req, res, function(err, data) {
    if (err || !data) {
      return cb(err)
    }
    debug('posting ', self.name, self.key, data, typeof data);
    this.model.post(data, cb);
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
    this.model.put(id, data, cb);
  });
};

RestModels.prototype.deleteHandler = function (req, res, id, cb) {
  if (!id) return cb('need an id to delete', false);
  debug('deleting ', this.name, this.key, id);
  this.model.delete(id, cb);
};

RestModels.prototype.getHandler = function (req, res, id, cb) {
  // cb = function (err, data)
  var self = this
  if (!id) {
    // get by url query parameters
    var qs = url.parse(req.url, true).query

    if (Object.keys(qs).length > 0) {
      debug('looking up qs', qs)
      this.model.get(qs, cb);
    }
    else {
      debug('returning all values')
      this.model.all(cb);
    }
  }
  else {
    debug('getting by id', id)
    this.model.get(id, cb);
  }
};

