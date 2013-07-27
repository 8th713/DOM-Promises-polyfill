describe('The Promise.any(values...) method: ', function () {
  'use strict';

  var isCommonJs = (typeof exports === 'object'),
      assert = isCommonJs ? require('assert') : chai.assert,
      sinon = isCommonJs ? require('sinon') : window.sinon,
      utli = isCommonJs ? require('./helpers/utli.js') : window.utli;

  var dummy = { dummy: 'dummy' };

  specify('This is a static method.', function () {
    assert(Promise.any);
    assert.strictEqual(typeof Promise.any, 'function');
  });

  specify('`values` is a variable length and any type.', function () {
    assert.doesNotThrow(function () {
      Promise.any.apply(Promise, [
        undefined,
        null,
        false,
        5,
        {},
        function () {}
      ]);
    });
  });

  describe('Returns a promise that is fulfilled or rejected ' +
  'when any of `values` is either fulfilled or rejected.', function () {
    var onFulfilled;
    var onRejected;

    beforeEach(function () {
      onFulfilled = sinon.spy();
      onRejected = sinon.spy();
    });

    specify('It is fulfilled by it when any of the `values` is fulfilled.', function (done) {
      Promise.any(
        utli.pending().promise,
        utli.pending().promise,
        utli.delayedReject(false, 20),
        utli.delayedFulfill(dummy, 10)
      ).then(onFulfilled, onRejected);

      setTimeout(function () {
        sinon.assert.calledOnce(onFulfilled);
        sinon.assert.calledWith(onFulfilled, dummy);
        sinon.assert.notCalled(onRejected);
        done();
      }, 50);
    });

    specify('It is rejected by it when any of the `values` is rejected.', function (done) {
      Promise.any(
        utli.pending().promise,
        utli.pending().promise,
        utli.delayedFulfill(false, 20),
        utli.delayedReject(dummy, 10)
      ).then(onFulfilled, onRejected);

      setTimeout(function () {
        sinon.assert.calledOnce(onRejected);
        sinon.assert.calledWith(onRejected, dummy);
        sinon.assert.notCalled(onFulfilled);
        done();
      }, 50);
    });

    specify('It is resolved by the values of first in that ' +
    'if any of the values is resolved already.', function (done) {
      Promise.any(
        utli.fulfill(dummy),
        utli.reject(false)
      ).then(onFulfilled, onRejected);

      setTimeout(function () {
        sinon.assert.calledOnce(onFulfilled);
        sinon.assert.calledWith(onFulfilled, dummy);
        sinon.assert.notCalled(onRejected);
        done();
      }, 50);
    });

    specify('Treat as a promise that has been fulfilled already ' +
    'if `values` is not a Thenable object.', function (done) {
      Promise.any(
        dummy,
        utli.reject(false),
        utli.fulfill(false)
      ).then(onFulfilled, onRejected);

      setTimeout(function () {
        sinon.assert.calledWith(onFulfilled, dummy);
        sinon.assert.notCalled(onRejected);
        done();
      }, 50);
    });
  });
});
