level-restful
=============

A simple plug and play REST wrapper for any ORM.

A REST client can call any of the basic REST api calls, implemented according to [this spec](http://www.restapitutorial.com/lessons/httpmethods.html)

```
GET /model
GET /model/id
POST /model
PUT /model/id
DELETE /model/id
```


[![NPM](https://nodei.co/npm/level-restful.png?compact=true)](https://nodei.co/npm/level-restful/)

[![build status](https://secure.travis-ci.org/karissa/level-restful.png)](http://travis-ci.org/karissa/level-restful)

# Installation
This module is installed via npm:

```bash
$ npm install level-restful
```

## Usage

### Basic example

```js
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

```

#### Wire up your models to your server

The below example is just one of the many ways of wiring up your models to the server.

```js
var QuickRestModel = require('quickrest-model')

var simple = new Simple('owner_id')

var Router = require('routes-router');
var router = Router();

// Wire up API endpoints
router.addRoute('/api/simple/id?', function(req, res, opts) {
  var id = parseInt(opts.params.id) || opts.params.id || ''
  simpleRestModel.dispatch(req, res, id, function (err, data) {
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

var server = http.createServer(router)''
server.listen(8000)''
```

Here's an example of doing filtering via the query api:

```bash
$ curl 'http://localhost:8000/api/book?name=Moby%20Dick'
[
  {
    'owner_id': 4,
    'author': 'Mark Twain',
    'name': 'Moby Dick'
  },
  {
    'owner_id': 4,
    'author': 'Mark Twain',
    'name': 'Moby Dick'
  }
]
```

#### Compound Keys and Shared Containers
This library extends from [eugeneware/level-orm](https://github.com/eugeneware/level-orm), which has examples of Compound Keys and Shared Containers.


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

