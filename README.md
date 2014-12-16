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
function Book() {
  this.currentKey = 0
  this.db = {}
}

Book.prototype.post = function (model, cb) {
  if(!model) {
    return cb('Need values to save')
  }
  var key = this.currentKey += 1
  this.db[key] = model
  this.currentKey = key
  return cb(null, key)
}

Book.prototype.get = function (key, cb){
  if(!key) {
    return cb('Need a key')
  }
  var val = this.db[key]
  if (!val) {
    return cb('NotFound')
  }
  return cb(null, this.db[key])
}

Book.prototype.put = function (key, model, cb) {
  if(!key) {
    return cb('Need a key')
  }
  this.db[key] = model
  return cb(null, key)
}

Book.prototype.delete = function (key, cb) {
  if(!key) {
    return cb('Need a key')
  }
  delete this.db[key]
  return cb(null)
}

Book.prototype.all = function (cb) {
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
var Book = require('./book.js')

var bookDB = new Book()
var bookModel = QuickRestModel(bookDB)

// Wire up API endpoints
router.addRoute('/api/book/id?', function(req, res, opts) {
  bookModel.dispatch(req, res, id, function (err, data) {
   if (err) {
      res.statusCode = 500;
      return res.end()
    }

    res.statusCode = 200
    res.end(JSON.stringify(data));
  })
})

var server = http.createServer(router)''
server.listen(8000)''
```


```bash
$ curl -x POST 'http://localhost:8000/api/book' -d {'author': 'Mark Twain', 'name': 'Adventures of Huckleberry Finn'}
44
```

```bash
$ curl -x POST 'http://localhost:8000/api/book' -d {'author': 'Mark Twain', 'name': 'N/A'}
45
```

```bash
$ curl -x PUT 'http://localhost:8000/api/book/45' -d {'author': 'Mark Twain', 'name': 'Life on the Mississippi'}
45
```

```bash
$ curl 'http://localhost:8000/api/book'
[
  {
    'id': 44,
    'author': 'Mark Twain',
    'name': 'Adventures of Huckleberry Finn'
  },
  {
    'id': 45,
    'author': 'Mark Twain',
    'name': 'Life on the Mississippi'
  }
]
```

```bash
$ curl 'http://localhost:8000/api/book/45'
{
  'id': 45,
  'author': 'Mark Twain',
    'name': 'Life on the Mississippi'
}
```

```bash
$ curl -x DELETE 'http://localhost:8000/api/book/45'
```

```bash
$ curl 'http://localhost:8000/api/book'
[
  {
    'id': 44,
    'author': 'Mark Twain',
    'name': 'Adventures of Huckleberry Finn'
  }
]
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

