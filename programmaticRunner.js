'use strict';

var async = require('async');
var Mocha = require('mocha');
var path = require('path');
var fs = require('fs');

var domPromisepTests = path.resolve(__dirname, 'tests/DOM-Promisep-tests');
var promisesAPlusTests = path.resolve(__dirname, 'tests/promises-tests');

function createTask(Promise, dirPath) {
  return function (next) {
    var mocha = new Mocha({
      reporter: 'spec',
      timeout: 200,
      slow: Infinity
    });

    fs.readdir(dirPath, function (err, testFileNames) {
      if (err) {
        next(err);
        return;
      }

      testFileNames.forEach(function (testFileName) {
        if (path.extname(testFileName) === '.js') {
          var testFilePath = path.resolve(dirPath, testFileName);
          mocha.addFile(testFilePath);
        }
      });

      global.Promise = Promise;
      mocha.run(function (failures) {
        delete global.Promise;
        if (failures > 0) {
          var err = new Error('Test suite failed with ' + failures + ' failures.');
          err.failures = failures;
          next(err);
        } else {
          next(null);
        }
      });
    });
  };
}


module.exports = function (Promise, opt, callback) {
  var tasks = [];


  if (opt === '-d') {
    tasks.push(createTask(Promise, domPromisepTests));
  } else if (opt === '-p') {
    tasks.push(createTask(Promise, promisesAPlusTests));
  } else {
    tasks.push(createTask(Promise, domPromisepTests));
    tasks.push(createTask(Promise, promisesAPlusTests));
  }

  async.series(tasks, function(err) {
    if(err) {
      callback(err);
      return;
    }
    callback();
  });
};
