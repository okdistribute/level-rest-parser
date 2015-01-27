var http = require('http');
var Router = require('routes-router');

var level = require('level-prebuilt');
var bytewise = require('bytewise/hex');
var RestParser = require('rest-parser')
var LevelRest = require('..')

function createModel(dbPath) {
  var db = level(dbPath,
    {
      keyEncoding: bytewise,
      valueEncoding: 'json'
    }
  );
  var schema = {
    "type": "object",
    "properties": {
      "owner_id": {
        "type": "number",
        "required": true,
      },
      "name": {
        "type": "string",
        "required": true,
      },
      "url": {
        "type": "string",
        "required": true,
      },
      "license": {
        "type": "string"
      }
    }
  }
  var opts = {
    schema: schema
  }
  var model = LevelRest(db, opts)

  var example = new RestParser(model)

  return {
    db: db, // for closing the handler on server shutdown
    example: example
  };
};


function Server (dbPath) {
  var models = createModel(dbPath);

  var router = Router();
  // Wire up API endpoints
  router.addRoute('/api/:model/:id?', function(req, res, opts, cb) {
    var id = opts.params.id || ''
    var model = models[opts.params.model]
    if (!model) {
      console.error('no model')
      return cb(new Error('no model'))
    }
    var opts = {
      id: id
    }
    models.example.dispatch(req, opts, function (err, data) {
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
