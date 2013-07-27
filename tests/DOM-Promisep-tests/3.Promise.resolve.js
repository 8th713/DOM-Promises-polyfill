describe('The Promise.resolve(value) method:', function () {
  'use strict';

  var isCommonJs = (typeof exports === 'object'),
      assert = isCommonJs ? require('assert') : chai.assert,
      utli = isCommonJs ? require('./helpers/utli.js') : window.utli;

  var dummy = { dummy: 'dummy' };

  specify('This is a static method.', function () {
    assert(Promise.resolve);
    assert.strictEqual(typeof Promise.resolve, 'function');
  });

  specify('`value` are any type.', function () {
    function test(value) {
      assert.doesNotThrow(function () {
        Promise.resolve(value);
      });
    }

    test(undefined);
    test(null);
    test(false);
    test(5);
    test({});
    test(function () {});
  });

  specify('Returns a promise that depends upon `value`.', function (done) {
    var semiDone = utli.callbackAggregator(2, done);
    var fulfilledPromise = utli.fulfill(dummy);
    var rejectedPromise = utli.reject(dummy);

    Promise.resolve(fulfilledPromise).then(function (value) {
      assert.strictEqual(value, dummy);
      semiDone();
    });

    Promise.resolve(rejectedPromise).then(null, function (reason) {
      assert.strictEqual(reason, dummy);
      semiDone();
    });
  });

  specify('Is synonymous with Promise.fulfill if `value` is not thenable object.', function (done) {
    Promise.resolve(dummy).then(function (arg) {
      assert.strictEqual(arg, dummy);
      done();
    });
  });
});
