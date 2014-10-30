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

**Create your models**

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

The below example is just one of the many ways of wiring up your models to the server. Because this is a tool, **not a framework**, we leave it up to you to tailor it to your use case.

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

# License
Copyright (c) 2014, Karissa McKelvey
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

