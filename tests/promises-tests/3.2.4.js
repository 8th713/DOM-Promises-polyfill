'use strict';

describe('3.2.4: `then` must return before `onFulfilled` or `onRejected` is called', function () {
  var assert, helper;

  if (typeof exports === 'object') {
    assert = require('assert');
    helper = require('./helpers/testThreeCases.js');
  } else {
    assert = chai.assert;
    helper = window.helper;
  }

  var testFulfilled = helper.testFulfilled;
  var testRejected = helper.testRejected;

  var dummy = { dummy: 'dummy' }; // we fulfill or reject with this when we don't intend to test against it

  testFulfilled(dummy, function (promise, done) {
    var thenHasReturned = false;

    promise.then(function onFulfilled() {
      assert(thenHasReturned);
      done();
    });

    thenHasReturned = true;
  });

  testRejected(dummy, function (promise, done) {
    var thenHasReturned = false;

    promise.then(null, function onRejected() {
      assert(thenHasReturned);
      done();
    });

    thenHasReturned = true;
  });
});
