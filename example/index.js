var http = require('http');
var Router = require('routes-router');

var level = require('level-prebuilt');
var bytewise = require('bytewise/hex');
var QuickRest = require('quickrest')
var QuickRestLevel = require('..')

function createModel(dbPath) {
  var db = level(dbPath,
    {
      keyEncoding: bytewise,
      valueEncoding: 'json'
    }
  );
  var model = new QuickRestLevel(db, 'level', 'owner_id')

  return {
    db: db, // for closing the handler on server shutdown
    level: model
  };
};


function Server (dbPath) {
  var models = createModel(dbPath);

  var router = Router();
  // Wire up API endpoints
  router.addRoute('/api/:model/:id?', function(req, res, opts, cb) {
    var id = parseInt(opts.params.id) || opts.params.id || ''
    var model = models[opts.params.model]
    if (!model) {
      return cb(new Error('no model'))
    }
    QuickRest.dispatch(model, req, res, id, function (err, data) {
      if (err) {
        console.error(err)
        res.statusCode = 500;
        res.end(JSON.stringify({'error': err.message}));
        return
      }

      res.statusCode = 200
      res.end(JSON.stringify(data));
    })
  });

  var server = http.createServer(router);
  var port = 5000;

  return  {
    server: server,
    port: port,
    models: models
  };
}


module.exports = Server;
