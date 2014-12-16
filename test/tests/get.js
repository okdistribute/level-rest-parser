var request = require('request').defaults({json: true});
var debug = require('debug')('get')

module.exports.all = function (test, common, endpoint) {
  test('GET ' + endpoint, function (t) {

    var data = {
      'owner_id': 2,
      'name': 'test entry',
      'url': 'http://dat-data.dathub.org',
      'license': 'BSD-2'
     // 'keywords': ['entry', 'test', 'data', 'dathub']
    };

    common.testPOST(t, '/api/' + endpoint, data,
      function (err, api, res, json, done) {
        t.ifError(err);
        t.equal(res.statusCode, 200, 'POST statusCode 200');
        t.ok(json, 'POST returns id')
        debug('id created', json);

        request('http://localhost:' + api.port + '/api/' + endpoint + '/' + json,
          function (err, res, json) {
            t.ifError(err);
            t.equal(res.statusCode, 200, 'GET statusCode 200');
            t.deepEqual(data, json, 'GET returns correct created data');
          }
        );

        request('http://localhost:' + api.port + '/api/' + endpoint,
          function (err, res, json) {
            t.ifError(err);
            t.equal(res.statusCode, 200, 'GET statusCode 200');
            t.equal(json.length, 1, 'GET get correct object length back');
            done();
          }
        );
      }
    );

  });
};
