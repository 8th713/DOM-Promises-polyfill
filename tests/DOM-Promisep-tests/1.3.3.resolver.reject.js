describe('resolver.reject(value):', function () {
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
        resolver.reject(value);
      });
    }

    test(undefined);
    test(null);
    test(false);
    test(5);
    test({});
    test(function () {});
  });

  specify('Promise is rejected, ' +
  'and rejectCallback is invoked with `value`.', function (done) {
    var dfd = utli.pending(), spy = sinon.spy();

    dfd.promise.then(null, spy);
    dfd.resolver.reject(dummy);
    dfd.promise.then(null, spy);

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
    dfd.resolver.fulfill(dummy); // promise is resolved.
    dfd.resolver.reject(dummy);

    setTimeout(function () {
      sinon.assert.notCalled(spy2);
      sinon.assert.calledWith(spy1, dummy);
      done();
    }, 50);
  });
});
