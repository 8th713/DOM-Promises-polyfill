describe('resolver.fulfill(value):', function () {
  'use strict';

  var isCommonJs = (typeof exports === 'object'),
      assert = isCommonJs ? require('assert') : chai.assert,
      sinon = isCommonJs ? require('sinon') : window.sinon,
      utli = isCommonJs ? require('./helpers/utli.js') : window.utli;

  var dummy = { dummy: 'dummy' };

  specify('`value` are any type.', function () {
    function test(value) {
      var resolver = utli.pending().resolver;

      assert.doesNotThrow(function () {
        resolver.fulfill(value);
      });
    }

    test(undefined);
    test(null);
    test(false);
    test(5);
    test({});
    test(function () {});
  });

  specify('Promise is fulfilled, ' +
  'and fulfillCallback is invoked with `value`.', function (done) {
    var dfd = utli.pending(), spy = sinon.spy();

    dfd.promise.then(spy);
    dfd.resolver.fulfill(dummy);
    dfd.promise.then(spy);

    setTimeout(function () {
      sinon.assert.calledWith(spy, dummy);
      sinon.assert.callCount(spy, 2);
      done();
    }, 50);
  });

  specify('Do nothing if promise is resolved already.', function (done) {
    var dfd = utli.pending(),
        spy1 = sinon.spy(),
        spy2 = sinon.spy();

    dfd.promise.then(spy1, spy2);
    dfd.resolver.reject(dummy); // promise is resolved.
    dfd.resolver.fulfill(dummy);

    setTimeout(function () {
      sinon.assert.notCalled(spy1);
      sinon.assert.calledWith(spy2, dummy);
      done();
    }, 50);
  });
});
