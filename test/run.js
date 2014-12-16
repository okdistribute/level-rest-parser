var test = require('tape');
var path = require('path');
var common = require('./common.js')();


var testFiles = [
  'empty.js',
  'update.js',
  'get.js',
  'delete.js',
  'create.js'
];

var models = [
  'example'
];

var tests = [];
for (var i in testFiles) {
  tests.push(require(path.join(__dirname, 'tests', testFiles[i])));
}

// var finish = require(path.join(__dirname, 'tests', 'finish.js'))

var specificTestFile = process.argv[2];
var specificTest = process.argv[3];

if (specificTestFile) {
  var testModule = require(path.join(__dirname, specificTestFile));
  if (specificTest) {
     runTestModule(testModule[specificTest])
  }
  else runTestModule(testModule)
} else {
  runAll();
}

function runTestModule(testModule) {
  models.map(function(model) {
    testModule.all(test, common, model);
  });
}

function runAll() {
  tests.map(runTestModule)
}