var request = require('request').defaults({json: true});

module.exports.all = function (test, common, endpoint) {
  test('POST ' + endpoint, function(t) {
    var data = {
      'owner_id': 1,
      'name': 'test entry',
      'url': 'http://dat-data.dathub.org',
      'license': 'BSD-2'
     // 'keywords': ['entry', 'test', 'data', 'dathub']
    };

    common.testPOST(t, '/api/' + endpoint, data,
      function (err, api, res, json, done) {
        t.ifError(err);
        t.equal(res.statusCode, 200);
        t.equal(typeof json, 'number', 'correct id type generated');
        done();
      }
    );
  });

  test('invalid json throws 500', function(t) {
    common.testPOST(t, '/api/' + endpoint, undefined,
      function (err, api, res, json, done) {
        t.ifError(err);
        t.equal(res.statusCode, 500);
        done();
      }
    );
  });

  test('invalid method type throws 500', function(t) {
    var data = {
      'owner_id': 'DELETE FROM *',
      'name': 'hello',
      'url': 'http://dat-data.dathub.org',
      'license': 'BSD-2'
     // 'keywords': ['entry', 'test', 'data', 'dathub']
    };

    common.getRegistry(t, function (err, api, done) {
      request({
        method: 'OPTIONS',
        uri: 'http://localhost:' + api.port + '/api/' + endpoint,
      },
      function (err, res, json) {
        t.ifError(err);
        t.equal(res.statusCode, 500);
        done()
      })
    });
  });

};

