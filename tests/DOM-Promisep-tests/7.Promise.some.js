describe('The Promise.some(values...) method: ', function () {
  'use strict';

  var isCommonJs = (typeof exports === 'object'),
      assert = isCommonJs ? require('assert') : chai.assert,
      sinon = isCommonJs ? require('sinon') : window.sinon,
      utli = isCommonJs ? require('./helpers/utli.js') : window.utli;

  var dummy = { dummy: 'dummy' };

  specify('This is a static method.', function () {
    assert(Promise.some);
    assert.strictEqual(typeof Promise.some, 'function');
  });

  specify('`values` is a variable length and any type.', function () {
    assert.doesNotThrow(function () {
      Promise.some.apply(Promise, [
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
  'when one of `values` is fulfilled or all are rejected.', function () {
    var onFulfilled;
    var onRejected;

    beforeEach(function () {
      onFulfilled = sinon.spy();
      onRejected = sinon.spy();
    });

    specify('It is rejected by array of the rejection reason ' +
    'when all `values` are rejected.', function (done) {
      Promise.some(
        utli.reject(1),
        utli.delayedReject(2),
        utli.reject(dummy)
      ).then(onFulfilled, onRejected);

      setTimeout(function () {
        sinon.assert.calledWith(onRejected, [1, 2, dummy]);
        sinon.assert.notCalled(onFulfilled);
        done();
      }, 50);
    });

    specify('It is fulfilled by that fulfillment value ' +
    'when one of `values` is fulfilled.', function (done) {
      Promise.some(
        utli.reject(1),
        utli.reject(2),
        utli.delayedFulfill(dummy)
      ).then(onFulfilled, onRejected);

      setTimeout(function () {
        sinon.assert.calledWith(onFulfilled, dummy);
        sinon.assert.notCalled(onRejected);
        done();
      }, 50);
    });

    specify('Treat as a promise that has been fulfilled already' +
    'when the `values` is not a Thenable object.', function (done) {
      Promise.some(
        dummy,
        utli.delayedFulfill(1),
        utli.fulfill(2)
      ).then(onFulfilled, onRejected);

      setTimeout(function () {
        sinon.assert.calledWith(onFulfilled, dummy);
        sinon.assert.notCalled(onRejected);
        done();
      }, 50);
    });
  });
});
