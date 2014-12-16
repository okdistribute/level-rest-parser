var request = require('request').defaults({json: true});

module.exports.all = function (test, common, endpoint) {
  test('creates a new Metadat via POST then deletes it', function(t) {
    var data = {
      'owner_id': 1,
      'name': 'test entry',
      'url': 'http://dat-data.dathub.org',
      'license': 'BSD-2'
     // 'keywords': ['entry', 'test', 'data', 'dathub']
    };

    common.testPOST(t, '/api/' + endpoint , data,
      function (err, api, res, json, done) {
        t.ifError(err);
        t.equal(res.statusCode, 200, 'POST 200 statusCode');
        t.equal(typeof json, 'number', 'POST returns id');

        var metadatID = json;

        request({
          method: 'DELETE',
          uri: 'http://localhost:' + api.port + '/api/' + endpoint + '/' + metadatID,
          json: data
        }, function (err, res, json) {
          t.ifError(err);
          t.equal(res.statusCode, 200, 'POST 200 statusCode');

          request('http://localhost:' + api.port + '/api/' + endpoint + '/' + metadatID,
            function (err, res, json) {
              t.ifError(err);
              t.equal(res.statusCode, 500, 'POST 500 statusCode when no object to delete with that id');
              done();
            }
          );
        }
      );
    });
  });
};