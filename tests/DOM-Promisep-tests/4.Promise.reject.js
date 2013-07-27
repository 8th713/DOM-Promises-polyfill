describe('The Promise.reject(value) method:', function () {
  'use strict';

  var isCommonJs = (typeof exports === 'object'),
      assert = isCommonJs ? require('assert') : chai.assert;

  var dummy = { dummy: 'dummy' };

  specify('This is a static method.', function () {
    assert(Promise.reject);
    assert.strictEqual(typeof Promise.reject, 'function');
  });

  specify('`value` are any type.', function () {
    function test(value) {
      assert.doesNotThrow(function () {
        Promise.reject(value);
      });
    }

    test(undefined);
    test(null);
    test(false);
    test(5);
    test({});
    test(function () {});
  });

  specify('Returns a promise that is rejected with `value`.', function (done) {
    Promise.reject(dummy).then(null, function (reason) {
      assert.strictEqual(reason, dummy);
      done();
    });
  });
});
