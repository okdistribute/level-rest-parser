quickrest-orm
=============

A simple plug and play REST wrapper for any ORM.

[![NPM](https://nodei.co/npm/level-restful.png?compact=true)](https://nodei.co/npm/level-restful/)

[![build status](https://secure.travis-ci.org/karissa/level-restful.png)](http://travis-ci.org/karissa/level-restful)


A REST client can call any of the basic REST api calls, implemented according to [this spec](http://www.restapitutorial.com/lessons/httpmethods.html). It will parse the request object and call the corresponding database object's method.


```
GET /model
GET /model/id
POST /model
PUT /model/id
DELETE /model/id
```


# Installation
This module is installed via npm:

```bash
$ npm install quickrest-orm
```

## Usage

You need to create an object (ORM) that has the methods ```.post```, ```.get```, ```.put```, ```.delete```, and ```.all```

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

### Create a server

You can then wrap your new Book in a ```QuickRestModel```. It gives you the method ```dispatch``` which is used in the below example:

```js
var QuickRestModel = require('quickrest-orm')
var Book = require('./book.js')

// make the book model
var bookDB = new Book()
var bookModel = QuickRestModel(bookDB)

// Wire up API endpoints
router.addRoute('/api/book/id?', function(req, res) {

  var id = ... // get id here

  bookModel.dispatch(req, res, id, function (err, data) {

    // data will be whatever you return from your model by the appropriate REST method call

  })
})

var server = http.createServer(router)''
server.listen(8000)''
```


### Create a server


### Examples

Create a new book

```bash
$ curl -x POST 'http://localhost:8000/api/book' -d {'author': 'Mark Twain', 'name': 'N/A'}
1
```

Update a book

```bash
$ curl -x PUT 'http://localhost:8000/api/book/1' -d {'author': 'Mark Twain', 'name': 'Life on the Mississippi'}
1
```

Get all books

```bash
$ curl 'http://localhost:8000/api/book'
[
  {
    'id': 1,
    'author': 'Mark Twain',
    'name': 'Life on the Mississippi'
  },
  etc...
]
```

Get a single book

```bash
$ curl 'http://localhost:8000/api/book/1'
{
  'id': 1,
  'author': 'Mark Twain',
  'name': 'Life on the Mississippi'
}
```

Delete a book

```bash
$ curl -x DELETE 'http://localhost:8000/api/book/1'
```

Get all books (none remain)

```bash
$ curl 'http://localhost:8000/api/book'
[]
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

