var request = require('request').defaults({json: true});
var debug = require('debug')('update')

module.exports.all = function (test, common, endpoint) {
  //TODO: callback hell! want to use promises?
  test('PUT/update', function (t) {
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
        t.equal(res.statusCode, 200, 'POST statusCode 200');
        debug('debugin', json);
        t.equal(typeof json, 'number', 'POST get id back')
        data.id = json;

        data.name = 'modify name field';
        request({
          method: 'PUT',
          uri: 'http://localhost:' + api.port + '/api/' + endpoint + '/' + data.id,
          json: data
        },
          function (err, res, json) {
            t.ifError(err);
            t.equal(res.statusCode, 200, 'PUT statusCode 200');

            request({
              method: 'GET',
              uri: 'http://localhost:' + api.port + '/api/' + endpoint + '/' + data.id,
              json: data
            }, function (err, res, json) {
              t.equal(json.name, 'modify name field', 'PUT, modify name field returns properly');
              t.deepEqual(json, data, 'after PUT, all fields match the first time');

              data.name = 'testing two fields';
              data.owner_id = 23;

              request({
                method: 'PUT',
                uri: 'http://localhost:' + api.port + '/api/' + endpoint + '/' + data.id,
                json: data
              },
                function (err, res, json) {
                  t.ifError(err);
                  t.equal(res.statusCode, 200, 'PUT 200 statusCode');

                  request({
                    method: 'GET',
                    uri: 'http://localhost:' + api.port + '/api/' + endpoint + '/' + data.id,
                    json: data
                  }, function (err, res, json) {
                      t.equal(json.name, 'testing two fields', 'PUT, modify name field returns properly');
                      t.equal(json.owner_id, 23, 'after PUT, owner_id also changes');
                      t.deepEqual(data, json, 'after PUT, all fields match');
                      done();
                    }
                  );
                }
              );
            }
          );
        });
      }
    );
  });
};



