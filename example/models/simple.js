
module.exports = Simple

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
