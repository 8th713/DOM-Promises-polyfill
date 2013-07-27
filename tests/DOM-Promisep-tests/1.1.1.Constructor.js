describe('The Promise(init) constructor:', function () {
  'use strict';

  var isCommonJs = (typeof exports === 'object'),
      assert = isCommonJs ? require('assert') : chai.assert,
      sinon = isCommonJs ? require('sinon') : window.sinon;

  specify('`init` is function type.', function () {
    function test(value) {
      assert.throws(function () {
        new Promise(value);
      }, TypeError);
    }

    assert.strictEqual(Promise.length, 1);

    assert.doesNotThrow(function () {
      new Promise(function () {});
    }, TypeError);

    test(undefined);
    test(null);
    test(false);
    test(5);
    test({});
  });

  specify('Invoke `init`.', function () {
    var spy = sinon.spy();

    new Promise(spy);
    sinon.assert.called(spy);
  });

  specify('`this` of `init` is a promise object.', function () {
    var thisObj;
    var promise = new Promise(function () {
      thisObj = this;
    });

    assert.strictEqual(thisObj, promise);
  });

  specify('First argument of `init` is resolver object.', function () {
    new Promise(function (resolver) {
      assert(resolver);
      assert(resolver.fulfill);
      assert(resolver.resolve);
      assert(resolver.reject);
    });
  });

  specify('Promise is rejected for reasons of it ' +
  'if `init` is thrown exception.', function (done) {
    var exception = 'any exception';
    var promise = new Promise(function () {
      throw exception;
    });

    promise.then(null, function (reason) {
      assert.strictEqual(reason, exception);
      done();
    });
  });

  specify('Follows the it resolution ' +
  'if resolved before the exception is thrown.', function (done) {
    var promise = new Promise(function (resolver) {
      resolver.fulfill(true);
      throw 'any exception';
    });

    promise.then(function (value) {
      assert.strictEqual(value, true);
      done();
    });
  });
});
