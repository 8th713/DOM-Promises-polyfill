'use strict';

describe('3.2.2: If `onFulfilled` is a function,', function () {
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
  var sentinel = { sentinel: 'sentinel' }; // a sentinel fulfillment value to test for with strict equality

  describe('3.2.2.1: it must be called after `promise` is fulfilled, with `promise`’s fulfillment value as its ' +
           'first argument.', function () {
    testFulfilled(sentinel, function (promise, done) {
      promise.then(function onFulfilled(value) {
        assert.strictEqual(value, sentinel);
        done();
      });
    });
  });

  describe('3.2.2.2: it must not be called more than once.', function () {
    specify('already-fulfilled', function (done) {
      var timesCalled = 0;

      Promise.fulfill(dummy).then(function onFulfilled() {
        assert.strictEqual(++timesCalled, 1);
        done();
      });
    });

    specify('trying to fulfill a pending promise more than once, immediately', function (done) {
      var timesCalled = 0;
      var promise = new Promise(function (tuple) {
        tuple.fulfill(dummy);
        tuple.fulfill(dummy);
      });

      promise.then(function onFulfilled() {
        assert.strictEqual(++timesCalled, 1);
        done();
      });
    });

    specify('trying to fulfill a pending promise more than once, delayed', function (done) {
      var timesCalled = 0;
      var promise = new Promise(function (tuple) {
        setTimeout(function () {
          tuple.fulfill(dummy);
          tuple.fulfill(dummy);
        }, 50);
      });

      promise.then(function onFulfilled() {
        assert.strictEqual(++timesCalled, 1);
        done();
      });
    });

    specify('trying to fulfill a pending promise more than once, immediately then delayed', function (done) {
      var timesCalled = 0;
      var promise = new Promise(function (tuple) {
        tuple.fulfill(dummy);
        setTimeout(function () {
          tuple.fulfill(dummy);
        }, 50);
      });

      promise.then(function onFulfilled() {
        assert.strictEqual(++timesCalled, 1);
        done();
      });
    });

    specify('when multiple `then` calls are made, spaced apart in time', function (done) {
      var timesCalled = [0, 0, 0];
      var promise = new Promise(function (tuple) {
        setTimeout(function () {
          tuple.fulfill(dummy);
        }, 150);
      });

      promise.then(function onFulfilled() {
        assert.strictEqual(++timesCalled[0], 1);
      });

      setTimeout(function () {
        promise.then(function onFulfilled() {
          assert.strictEqual(++timesCalled[1], 1);
        });
      }, 50);

      setTimeout(function () {
        promise.then(function onFulfilled() {
          assert.strictEqual(++timesCalled[2], 1);
          done();
        });
      }, 100);
    });

    specify('when `then` is interleaved with fulfillment', function (done) {
      var timesCalled = [0, 0];
      var tuple;
      var promise = new Promise(function (resolver) {
        tuple = resolver;
      });

      promise.then(function onFulfilled() {
        assert.strictEqual(++timesCalled[0], 1);
      });

      tuple.fulfill(dummy);

      promise.then(function onFulfilled() {
        assert.strictEqual(++timesCalled[1], 1);
        done();
      });
    });
  });

  describe('3.2.2.3: it must not be called if `onRejected` has been called.', function () {
    testRejected(dummy, function (promise, done) {
      var onRejectedCalled = false;

      promise.then(function onFulfilled() {
        assert.strictEqual(onRejectedCalled, false);
        done();
      }, function onRejected() {
        onRejectedCalled = true;
      });

      setTimeout(done, 100);
    });

    specify('trying to reject then immediately fulfill', function (done) {
      var onRejectedCalled = false;
      var promise = new Promise(function (tuple) {
        tuple.reject(dummy);
        tuple.fulfill(dummy);
      });

      promise.then(function onFulfilled() {
        assert.strictEqual(onRejectedCalled, false);
        done();
      }, function onRejected() {
        onRejectedCalled = true;
      });

      setTimeout(done, 100);
    });

    specify('trying to reject then fulfill, delayed', function (done) {
      var onRejectedCalled = false;
      var promise = new Promise(function (tuple) {
        setTimeout(function () {
          tuple.reject(dummy);
          tuple.fulfill(dummy);
        }, 50);
      });

      promise.then(function onFulfilled() {
        assert.strictEqual(onRejectedCalled, false);
        done();
      }, function onRejected() {
        onRejectedCalled = true;
      });

      setTimeout(done, 100);
    });

    specify('trying to reject immediately then fulfill delayed', function (done) {
      var onRejectedCalled = false;
      var promise = new Promise(function (tuple) {
        tuple.reject(dummy);
        setTimeout(function () {
          tuple.fulfill(dummy);
        }, 50);
      });

      promise.then(function onFulfilled() {
        assert.strictEqual(onRejectedCalled, false);
        done();
      }, function onRejected() {
        onRejectedCalled = true;
      });

      setTimeout(done, 100);
    });
  });
});
