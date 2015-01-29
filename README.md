level-rest-parser
=============

A simple request parser that enforces REST style with schema validation. Uses a leveldb instance for data storage. See [karissa/rest-parser](https://github.com/karissa/rest-parser) for examples of interacting with the REST API parser.

[![NPM](https://nodei.co/npm/level-rest-parser.png?compact=true)](https://nodei.co/npm/level-rest-parser/)

[![build status](https://secure.travis-ci.org/karissa/level-rest-parser.png)](http://travis-ci.org/karissa/level-rest-parser)


# Installation
This module is installed via npm:

```bash
$ npm install level-rest-parser
```

## Usage

### Schema Validation
Level-rest-parser validates the incoming requests pesky clients won't be able to muck up the database.

**bookSchema.json**
```json
{
  "type": "object",
  "properties": {
    "author_id": {
      "type": "number",
      "required": true,
    },
    "name": {
      "type": "string",
      "required": true,
    },
    "title": {
      "type": "string",
      "required": true,
    },
    "license": {
      "type": "string"
    }
  }
}
```

### Basic example

**Set up your LevelDB**
```js
var level = require('level-prebuilt');

var db = level(dbPath,
  {
    keyEncoding: require('bytewise/hex'),
    valueEncoding: 'json'
  }
);
```

**Create your models & rest-parser**
You pass the schema into your `LevelRest` instance and the rest parser will validate any objects before they are inserted into your leveldb
```js
var LevelRest = require('level-rest-parser')
var RestParser = require('rest-parser')

var Book = new RestParser(LevelRest(db, {
  schema: require('./bookSchema.json')
})

var models = {
  book: Book
}
```

**Set up the router**
```
router.addRoute('/api/:model/:id?', function(req, res, opts) {
  var id = opts.params.id
  var opts = {
    id: id
  }1
  var model = models[opts.params.model]
  if (!model) return res.end('No model found')
  model.dispatch(req, opts, function (err, data) {
    if (err) {
      res.statusCode = 500
      return res.end()
    }

    res.statusCode = 200
    res.json(data)
  })
})
```


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

