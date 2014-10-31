var path = require('path')

var config = {
  'DEBUG': true,
  'PORT': 5000,
  'HOSTNAME': 'http://localhost',
  'HOST': 'http://localhost:5000',
  'DB':  path.join(__dirname, '..', 'data')
};

module.exports = config;
