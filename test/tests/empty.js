var request = require('request').defaults({json: true});

module.exports.all = function (test, common, model) {
  test('empty', function (t) {
    common.getRegistry(t, function (err, api, done) {
      request('http://localhost:' + api.port + '/api/' + model,
        function (err, res, json) {
          t.ifError(err);
          console.log(json)
          t.equal(res.statusCode, 200);
          t.equal(json.length, 0);
          done();
        }
      );
    });
  });
};
