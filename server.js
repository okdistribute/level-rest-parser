var http = require('http')
var Router = require('routes-router')

var createModels = require('./models.js')

function Server () {
  var models = createModels()

  var router = Router()
  // Wire up API endpoints
  router.addRoute('/api/:model/:id?', function(req, res, opts) {
    var id = opts.params.id || ''
    var model = opts.params.model
    models[model].dispatch(req, res, id)
  })

  var server = http.createServer(router)
  var port = process.env['PORT'] || 5000
  server.listen(port, function() {
    console.log('listening on port', port)
  })

  return  {
    server: server,
    port: port,
    models: models
  }
}


module.exports = Server
