var request = require('request').defaults({json: true});
var debug = require('debug')('update')

module.exports.all = function (test, common) {
  //TODO: callback hell! want to use promises?
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

        data.name = 'test entry MODIFIED!';
        request({
          method: 'PUT',
          uri: 'http://localhost:' + api.port + '/api/metadat/' + json.id,
          json: data
        },
          function (err, res, json) {
            t.ifError(err);
            t.equal(res.statusCode, 200);
            data.id = json.id;
            t.equal(json.name, 'test entry MODIFIED!');
            t.deepEqual(json, data);

            data.name = 'test entry MODIFIED 1 more time!!';
            data.owner_id = 23;

            request({
              method: 'PUT',
              uri: 'http://localhost:' + api.port + '/api/metadat/' + json.id,
              json: data
            },
              function (err, res, json) {
                t.ifError(err);
                t.equal(res.statusCode, 200);
                data.id = json.id;
                t.equal(json.name, 'test entry MODIFIED 1 more time!!');
                t.equal(json.owner_id, 23);
                t.deepEqual(json, data);
                done();
              }
            );
          }
        );
      }
    );
  });
};



