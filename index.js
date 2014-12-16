var jsonBody = require('body/json');
var url = require('url')
var debug = require('debug')('restful');

module.exports = function (model, opts) {
  return new QuickRestModel(model, opts)
}

module.exports.model = QuickRestModel

function QuickRestModel(model, opts) {
  /*
  Parameters
  ------
  model : object
  the model object should have the following method signature:
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

QuickRestModel.prototype.dispatch = function (req, res, id, cb) {
  var self = this
  if (self.disabled) return cb('this model has rest endpoint disabled');
  var method = req.method.toLowerCase();
  switch (method) {
    case 'post':
      self.handlers.post.call(self, req, res, cb);
      break;
    case 'get':
      self.handlers.get.call(self, req, res, id, cb);
      break;
    case 'put':
      self.handlers.put.call(self, req, res, id, cb);
      break;
    case 'delete':
      self.handlers.delete.call(self, req, res, id, cb);
      break;
    default:
      cb('method must be one of post put get or delete')
      break;
  }
}

QuickRestModel.prototype.getBodyData = function (req, res, cb) {
  var self = this;
  var data = {};
  jsonBody(req, res, function (err, data) {
    if (err || !data) {
      return cb(err);
    }
    debug('request data\n', data);
    cb(null, data);
  });
}

QuickRestModel.prototype.handlers = {};

QuickRestModel.prototype.handlers.post = function (req, res, cb) {
  var self = this;
  self.getBodyData(req, res, function(err, data) {
    if (err || !data) {
      return cb(err)
    }
    debug('posting ', data);
    self.model.post(data, cb);
  });
};

QuickRestModel.prototype.handlers.put = function (req, res, id, cb) {
  var self = this;
  if (!id) return cb('need an id to put', false);

  self.getBodyData(req, res, function (err, data) {
    if (err || !data) {
      return cb(err)
    }
    debug('putting ', id, data);
    self.model.put(id, data, cb);
  });
};

QuickRestModel.prototype.handlers.delete = function (req, res, id, cb) {
  var self = this
  if (!id) return cb('need an id to delete', false);
  debug('deleting ', id);
  self.model.delete(id, cb);
};

QuickRestModel.prototype.handlers.get = function (req, res, id, cb) {
  // cb = function (err, data)
  var self = this
  if (!id) {
    // get by url query parameters
    var qs = url.parse(req.url, true).query

    if (Object.keys(qs).length > 0) {
      debug('looking up qs', qs)
      self.model.get(qs, cb);
    }
    else {
      debug('returning all values')
      self.model.all(cb);
    }
  }
  else {
    debug('getting by id', id)
    self.model.get(id, cb);
  }
};

