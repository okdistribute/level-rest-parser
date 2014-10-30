var jsonBody = require("body/json")
var Models = require('level-orm')
var util = require('util')
var debug = require('debug')('rest')

module.exports = RestModels

function RestModels(db, name, key, fields, opts) {
  this.fields = fields
  this.disabled = opts && opts.disabled || false
  Models.call(this, { db: db }, name, key)
}
util.inherits(RestModels, Models)


RestModels.prototype.dispatch = function (req, res, id, cb) {
  if (this.disabled) return cb('this model has rest endpoint disabled', false)
  var method = req.method.toLowerCase()
  switch (method) {
    case 'post':
      this.post(req, res, cb)
      break
    default:
      this[method](req, res, id, cb)
      break
  }
}

function fieldValid(field, incField) {
  if (!field.optional && !incField) {
    debug('field not optional or incField is empty', !field.optional, !incField)
    return false
  }
  return field.type === typeof incField || incField === undefined
}

RestModels.prototype.getBodyData = function (req, res, cb) {
  var self = this
  var data = {}
  jsonBody(req, res, function (err, body) {
    if (err) return cb(err)
    debug('request data\n', body)

    var field, incField
    for (i in self.fields) {
      field = self.fields[i]
      incField = body[field.name]

      if (!fieldValid(field, incField)) {
        debug('not validating request', field, incField, body)
        res.statusCode = 400
        res.end('request not validated')
      }
      else {
        data[field.name] = body[field.name]
      }
    }
    cb(null, data)
  })
}

RestModels.prototype.post = function (req, res, cb) {
  var self = this
  this.getBodyData(req, res, function(err, data) {
    debug('posting ', self.name, self.key, data)
    Models.prototype.save.call(self, data, function (err, id) {
      if (err) throw err
      res.statusCode = 201
      data[self.key] = id
      res.end(JSON.stringify(data))
    })
  })
}

RestModels.prototype.put = function (req, res, id, cb) {
  var self = this
  if (!id) return cb('need an id to put', false)

  this.getBodyData(req, res, function (err, data) {
    data[self.key] = id
    debug('putting ', self.name, self.key, data)
    Models.prototype.save.call(self, data, function (err) {
      if (err) throw err
      res.statusCode = 200
      res.end(JSON.stringify(data))
    })
  })
}

RestModels.prototype.delete = function (req, res, id, cb) {
  if (!id) return cb('need an id to delete', false)

  debug('deleting ', this.name, this.key, id)
  Models.prototype.del.call(this, id, function (err) {
    if (err) throw err
    res.statusCode = 200
    res.end()
  })
}

RestModels.prototype.get = function (req, res, id, cb) {
  if (!id) {
    Models.prototype.all.call(this, function (err, data) {
      if (err) throw err
      res.statusCode = 200
      res.end(JSON.stringify(data))
    })
  }
  else {
    Models.prototype.get.call(this, id, function (err, data) {
      if (err) {
        if (err.name === 'NotFoundError') {
          res.statusCode = 204
          res.end()
        }
      }
      res.statusCode = 200
      res.end(JSON.stringify(data))
    })
  }
}

