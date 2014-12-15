var request = require('request').defaults({json: true});
var debug = require('debug')('test');
var series = require('run-series')


function verifyMetadat(t, data, cb) {
  return function (err, res, json) {
    t.ifError(err);
    t.equal(res.statusCode, 201);
    t.equal(json.name, data.name);
    t.equal(json.owner_id, data.owner_id);
    t.equal(json.url, data.url);
    t.equal(json.license, data.license);
    debug('debugin', json);
    cb(null)
  }
}

function createMetadat(data, port, cb) {
  request({
    uri: 'http://localhost:' + port + '/api/metadat',
    json: data,
    method: 'POST'
  }, cb)
}


module.exports.all = function (test, common) {
  test('get a metadat', function (t) {

    var data = {
      'owner_id': 1,
      'name': 'test entry',
      'url': 'http://dat-data.dathub.org',
      'license': 'BSD-2'
     // 'keywords': ['entry', 'test', 'data', 'dathub']
    };

    common.testPOST(t, '/api/metadat', data,
      function (err, api, res, json, done) {
        t.ifError(err);
        t.equal(res.statusCode, 201);
        t.equal(json.name, data.name);
        t.equal(json.owner_id, data.owner_id);
        t.equal(json.url, data.url);
        t.equal(json.license, data.license);
        debug('debugin', json);

        series([
          function (callback) {
            // add another one with a different url
            data.url = 'http://dat-dat-dat.dathub.org'
            createMetadat(data, api.port, verifyMetadat(t, data, callback))
          },
          function (callback) {
            // add another one with a different url
            data.url = 'http://dat-dat-dat.dathub.org'
            createMetadat(data, api.port, verifyMetadat(t, data, callback))
          },
          function (callback) {
            // add another one with a early alphabet url
            data.url = 'http://aaaa.org'
            createMetadat(data, api.port, verifyMetadat(t, data, callback))
          },
          function (callback) {
            // add another one with a late alphabet url
            data.url = 'http://zzzz.org'
            createMetadat(data, api.port, verifyMetadat(t, data, callback))
          },
          function (callback) {
            request({
              uri: 'http://localhost:' + api.port + '/api/metadat',
              method: 'GET',
              qs: {
                url: 'http://dat-dat-dat.dathub.org'
              },
              json: true
            },
              function (err, res, json) {
                t.ifError(err);
                debug('debugin', json);
                t.equal(res.statusCode, 200);
                t.equal(json.length, 1);
                callback(null, 'two')
              }
            );
          },
          function (callback) {
            request({
              uri: 'http://localhost:' + api.port + '/api/metadat',
              method: 'GET',
              qs: {
                url: 'http://dat-data.dathub.org'
              },
              json: true
            },
              function (err, res, json) {
                t.ifError(err);
                debug('debugin', json);
                t.equal(res.statusCode, 200);
                t.equal(json.length, 1);
                callback(null, 'two')
              }
            );
          },
          function (callback) {
            request({
              uri: 'http://localhost:' + api.port + '/api/metadat',
              method: 'GET',
              qs: {
                url: 'http://aaaa.org'
              },
              json: true
            },
              function (err, res, json) {
                t.ifError(err);
                debug('debugin', json);
                t.equal(res.statusCode, 200);
                t.equal(json.length, 1);
                callback(null, 'two')
              }
            );
          },
          function (callback) {
            request({
              uri: 'http://localhost:' + api.port + '/api/metadat',
              method: 'GET',
              qs: {
                url: 'http://dat-dat-dat.dathub.org'
              },
              json: true
            },
              function (err, res, json) {
                t.ifError(err);
                debug('debugin', json);
                t.equal(res.statusCode, 200);
                t.equal(json.length, 2);
                callback(null, 'two')
              }
            );
          },
          function (callback) {
            request({
              uri: 'http://localhost:' + api.port + '/api/metadat',
              method: 'GET',
              qs: {
                url: 'http://zzzz.org'
              },
              json: true
            },
              function (err, res, json) {
                t.ifError(err);
                debug('debugin', json);
                t.equal(res.statusCode, 200);
                t.equal(json.length, 1);
                callback(null, 'two')
              }
            );
          }, function (callback) {
            console.log('requesting')
            request('http://localhost:' + api.port + '/api/metadat',
              function (err, res, json) {
                t.ifError(err);
                t.equal(res.statusCode, 200);
                t.equal(json.length, 5, 'should have all metadats');
                callback(null, 'three')
              }
            );
          },
          function (err, results) {
            done()
          }
        ])
      }
    )
  });
};
