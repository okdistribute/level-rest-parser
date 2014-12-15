var request = require('request').defaults({json: true});
var debug = require('debug')('test');
var series = require('run-series')

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
            request({
              uri: 'http://localhost:' + api.port + '/api/metadat',
              json: data,
              method: 'POST'
            },
              function (err, res, json) {
                t.ifError(err);
                t.equal(res.statusCode, 201);
                t.equal(json.name, data.name);
                t.equal(json.owner_id, data.owner_id);
                t.equal(json.url, data.url);
                t.equal(json.license, data.license);
                debug('debugin', json);
                callback(null, 'one');
              }
            )
          },
          function (callback) {
            // add another one with a different url
            data.url = 'http://dat-dat-dat.dathub.org'
            request({
              uri: 'http://localhost:' + api.port + '/api/metadat',
              json: data,
              method: 'POST'
            },
              function (err, res, json) {
                t.ifError(err);
                t.equal(res.statusCode, 201);
                t.equal(json.name, data.name);
                t.equal(json.owner_id, data.owner_id);
                t.equal(json.url, data.url);
                t.equal(json.license, data.license);
                debug('debugin', json);
                callback(null, 'one');
              }
            )
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
            console.log('requesting')
            request('http://localhost:' + api.port + '/api/metadat',
              function (err, res, json) {
                t.ifError(err);
                t.equal(res.statusCode, 200);
                t.equal(json.length, 3, 'should have all metadats');
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
