var request = require('request').defaults({json: true});
var debug = require('debug')('get')

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

        request('http://localhost:' + api.port + '/api/metadat/' + json.id,
          function (err, res, json) {
            t.ifError(err);
            t.equal(res.statusCode, 200);
            data.id = json.id;
            t.deepEqual(json, data);
          }
        );

        request('http://localhost:' + api.port + '/api/metadat',
          function (err, res, json) {
            t.ifError(err);
            t.equal(res.statusCode, 200);
            t.equal(json.length, 1);
            done();
          }
        );
      }
    );

  });
};
