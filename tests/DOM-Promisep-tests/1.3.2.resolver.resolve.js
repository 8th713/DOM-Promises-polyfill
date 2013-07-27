describe('resolver.resolve(value):', function () {
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
        resolver.resolve(value);
      });
    }

    test(undefined);
    test(null);
    test(false);
    test(5);
    test({});
    test(function () {});
  });

  specify('Promise is fulfilled or rejected. ' +
  'that states is depends upon `value`.', function (done) {
    function resolvedPromise(value) {
      return new Promise(function (resolver) {
        resolver.resolve(value);
      });
    }

    var spy1 = sinon.spy(),
        spy2 = sinon.spy(),
        spy3 = sinon.spy(),
        spy4 = sinon.spy(),
        spy5 = sinon.spy();

    var fulfilled = utli.fulfill(dummy),
        rejected = utli.reject(dummy),
        pending = utli.pending().promise;

    resolvedPromise(dummy).then(spy1); // normal.
    resolvedPromise(fulfilled).then(spy2); // fulfilled promise.
    resolvedPromise(rejected).then(null, spy3); // rejected promise.
    resolvedPromise(pending).then(spy4, spy5); // pending promise.

    setTimeout(function () {
      sinon.assert.calledWith(spy1, dummy);
      sinon.assert.calledWith(spy2, dummy);
      sinon.assert.calledWith(spy3, dummy);
      sinon.assert.notCalled(spy4);
      sinon.assert.notCalled(spy5);
      done();
    }, 50);
  });

  specify('Do nothing if promise is resolved already.', function (done) {
    var dfd = utli.pending(),
        spy1 = sinon.spy(),
        spy2 = sinon.spy();

    dfd.promise.then(spy1, spy2);
    dfd.resolver.reject(dummy); // promise is resolved.
    dfd.resolver.resolve(dummy);

    setTimeout(function () {
      sinon.assert.notCalled(spy1);
      sinon.assert.calledWith(spy2, dummy);
      done();
    }, 50);
  });
});
