describe('The Promise.fulfill(value) method: ', function () {
  'use strict';

  var isCommonJs = (typeof exports === 'object'),
      assert = isCommonJs ? require('assert') : chai.assert;

  var dummy = { dummy: 'dummy' };

  specify('This is a static method.', function () {
    assert(Promise.fulfill);
    assert.strictEqual(typeof Promise.fulfill, 'function');
  });

  specify('`value` are any type.', function () {
    function test(value) {
      assert.doesNotThrow(function () {
        Promise.fulfill(value);
      });
    }

    test(undefined);
    test(null);
    test(false);
    test(5);
    test({});
    test(function () {});
  });

  specify('Returns a promise that is fulfilled with `value`.', function (done) {
    Promise.fulfill(dummy).then(function (value) {
      assert.strictEqual(value, dummy);
      done();
    });
  });
});
