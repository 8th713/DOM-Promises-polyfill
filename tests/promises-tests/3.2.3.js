'use strict';

describe('3.2.3: If `onRejected` is a function,', function () {
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

  describe('3.2.3.1: it must be called after `promise` is rejected, with `promise`’s rejection reason as its ' +
           'first argument.', function () {
    testRejected(sentinel, function (promise, done) {
      promise.then(null, function onRejected(reason) {
        assert.strictEqual(reason, sentinel);
        done();
      });
    });
  });

  describe('3.2.3.2: it must not be called more than once.', function () {
    specify('already-rejected', function (done) {
      var timesCalled = 0;

      Promise.reject(dummy).then(null, function onRejected() {
        assert.strictEqual(++timesCalled, 1);
        done();
      });
    });

    specify('trying to reject a pending promise more than once, immediately', function (done) {
      var timesCalled = 0;
      var promise = new Promise(function (tuple) {
        tuple.reject(dummy);
        tuple.reject(dummy);
      });

      promise.then(null, function onRejected() {
        assert.strictEqual(++timesCalled, 1);
        done();
      });
    });

    specify('trying to reject a pending promise more than once, delayed', function (done) {
      var timesCalled = 0;
      var promise = new Promise(function (tuple) {
        setTimeout(function () {
          tuple.reject(dummy);
          tuple.reject(dummy);
        }, 50);
      });

      promise.then(null, function onRejected() {
        assert.strictEqual(++timesCalled, 1);
        done();
      });
    });

    specify('trying to reject a pending promise more than once, immediately then delayed', function (done) {
      var timesCalled = 0;
      var promise = new Promise(function (tuple) {
        tuple.reject(dummy);
        setTimeout(function () {
          tuple.reject(dummy);
        }, 50);
      });

      promise.then(null, function onRejected() {
        assert.strictEqual(++timesCalled, 1);
        done();
      });
    });

    specify('when multiple `then` calls are made, spaced apart in time', function (done) {
      var timesCalled = [0, 0, 0];
      var promise = new Promise(function (tuple) {
        setTimeout(function () {
          tuple.reject(dummy);
        }, 150);
      });

      promise.then(null, function onRejected() {
        assert.strictEqual(++timesCalled[0], 1);
      });

      setTimeout(function () {
        promise.then(null, function onRejected() {
          assert.strictEqual(++timesCalled[1], 1);
        });
      }, 50);

      setTimeout(function () {
        promise.then(null, function onRejected() {
          assert.strictEqual(++timesCalled[2], 1);
          done();
        });
      }, 100);

    });

    specify('when `then` is interleaved with rejection', function (done) {
      var timesCalled = [0, 0];
      var tuple;
      var promise = new Promise(function (resolver) {
        tuple = resolver;
      });

      promise.then(null, function onRejected() {
        assert.strictEqual(++timesCalled[0], 1);
      });

      tuple.reject(dummy);

      promise.then(null, function onRejected() {
        assert.strictEqual(++timesCalled[1], 1);
        done();
      });
    });
  });

  describe('3.2.3.3: it must not be called if `onFulfilled` has been called.', function () {
    testFulfilled(dummy, function (promise, done) {
      var onFulfilledCalled = false;

      promise.then(function onFulfilled() {
        onFulfilledCalled = true;
      }, function onRejected() {
        assert.strictEqual(onFulfilledCalled, false);
        done();
      });

      setTimeout(done, 100);
    });

    specify('trying to fulfill then immediately reject', function (done) {
      var onFulfilledCalled = false;
      var promise = new Promise(function (tuple) {
        tuple.fulfill(dummy);
        tuple.reject(dummy);
      });

      promise.then(function onFulfilled() {
        onFulfilledCalled = true;
      }, function onRejected() {
        assert.strictEqual(onFulfilledCalled, false);
        done();
      });

      setTimeout(done, 100);
    });

    specify('trying to fulfill then reject, delayed', function (done) {
      var onFulfilledCalled = false;
      var promise = new Promise(function (tuple) {
        setTimeout(function () {
          tuple.fulfill(dummy);
          tuple.reject(dummy);
        }, 50);
      });

      promise.then(function onFulfilled() {
        onFulfilledCalled = true;
      }, function onRejected() {
        assert.strictEqual(onFulfilledCalled, false);
        done();
      });

      setTimeout(done, 100);
    });

    specify('trying to fulfill immediately then reject delayed', function (done) {
      var onFulfilledCalled = false;
      var promise = new Promise(function (tuple) {
        tuple.fulfill(dummy);
        setTimeout(function () {
          tuple.reject(dummy);
        }, 50);
      });

      promise.then(function onFulfilled() {
        onFulfilledCalled = true;
      }, function onRejected() {
        assert.strictEqual(onFulfilledCalled, false);
        done();
      });

      setTimeout(done, 100);
    });
  });
});
