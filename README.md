level-quickrest
=============

A simple REST router for a leveldb instance.

[![NPM](https://nodei.co/npm/level-quickrest.png?compact=true)](https://nodei.co/npm/level-quickrest/)

[![build status](https://secure.travis-ci.org/karissa/level-quickrest.png)](http://travis-ci.org/karissa/level-quickrest)


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
$ npm install level-quickrest
```

## Usage


### Basic example

```js
var debug = require('debug')('models');
var Models = require('level-orm');
var level = require('level-prebuilt');
var util = require('util');
var bytewise = require('bytewise/hex');

var LevelRest = require('level-quickrest')
var QuickRest = require('quickrest')

var db = level(dbPath,
  {
    keyEncoding: bytewise,
    valueEncoding: 'json'
  }
);

var levelBook = new LevelRest(db, 'book', 'id');
var book = QuickRest(levelBook);
```

### Create a server

```js
// Wire up API endpoints
router.addRoute('/api/book/id?', function(req, res) {
  var id = ... // get id here
  book.dispatch(req, res, id, function (err, data) {
    res.end(JSON.stringify(data))
  })
})
```

#### Compound Keys and Shared Containers
A ```LevelRest``` instance extends from [eugeneware/level-orm](https://github.com/eugeneware/level-orm), which has examples of Compound Keys and Shared Containers and it can be used in an identical fashion.


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

