level-restful
=============

A simple plug and play REST wrapper for leveldb, as a simple extension to [level-orm](http://github.com/eugeneware/level-orm)

[![build status](https://secure.travis-ci.org/karissa/level-restful.png)](http://travis-ci.org/karissa/level-restful)

# Installation

This module is installed via npm:

```bash
$ npm install level-restful
```

## Usage

### Basic example

You extend the base class to give you REST post, put, delete, and get. You specify a list of fields to ensure validation of your object so the database stays safe from any pesky clients.

*Create your models*

```js
var http = require('http')
var level = require('level')
var db = level('/tmp/db', { valueEncoding: 'json' })
var RestModel = require('level-restful')

function Users(db) {

  var fields = [
    {
      'name': 'handle',
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
      'type': 'number',
      'optional': true
    }
  ]

  // users is the sublevel name to user
  // handle is the primary key
  RestModels.call(this, db, 'users', 'handle', fields)
}

models = {
  'users': Users
}
```

#### Wire up your models to your server

The below example is just one of the many ways of wiring up your models to the server. Because this is a tool, *not a framework*, we leave it up to you to tailor it to your use case.

```js
var Router = require('routes-router')
var router = Router()

// Wire up API endpoints
router.addRoute('/api/:model/:id?', function(req, res, opts) {
  var id = opts.params.id || ''
  var model = opts.params.model
  models[model].dispatch(req, res, id)
})

var server = http.createServer(router)
server.listen(8000)
```
*note: this uses res.end() under the hood.*