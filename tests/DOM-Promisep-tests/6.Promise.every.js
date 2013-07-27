describe('The Promise.every(values...) method: ', function () {
  'use strict';

  var isCommonJs = (typeof exports === 'object'),
      assert = isCommonJs ? require('assert') : chai.assert,
      sinon = isCommonJs ? require('sinon') : window.sinon,
      utli = isCommonJs ? require('./helpers/utli.js') : window.utli;

  var dummy = { dummy: 'dummy' };

  specify('This is a static method.', function () {
    assert(Promise.every);
    assert.strictEqual(typeof Promise.every, 'function');
  });

  specify('`values` is a variable length and any type.', function () {
    assert.doesNotThrow(function () {
      Promise.every.apply(Promise, [
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
  'when all `values` are fulfilled or any is rejected.', function () {
    var onFulfilled;
    var onRejected;

    beforeEach(function () {
      onFulfilled = sinon.spy();
      onRejected = sinon.spy();
    });

    specify('It is fulfilled by array of the fulfillment value ' +
    'when all `values` are fulfilled.', function (done) {
      Promise.every(
        utli.fulfill(1),
        utli.delayedFulfill(2),
        utli.fulfill(dummy)
      ).then(onFulfilled, onRejected);

      setTimeout(function () {
        sinon.assert.calledWith(onFulfilled, [1, 2, dummy]);
        sinon.assert.notCalled(onRejected);
        done();
      }, 50);
    });

    specify('It is rejected by that rejection reason ' +
    'when one of `values` is rejected.', function (done) {
      Promise.every(
        utli.fulfill(1),
        utli.fulfill(2),
        utli.delayedReject(dummy)
      ).then(onFulfilled, onRejected);

      setTimeout(function () {
        sinon.assert.calledWith(onRejected, dummy);
        sinon.assert.notCalled(onFulfilled);
        done();
      }, 50);
    });

    specify('Treat as a promise that has been fulfilled already' +
    'when the `values` is not a Thenable object.', function (done) {
      Promise.every(
        dummy,
        utli.delayedFulfill(1),
        utli.fulfill(2)
      ).then(onFulfilled, onRejected);

      setTimeout(function () {
        sinon.assert.calledWith(onFulfilled, [dummy, 1, 2]);
        sinon.assert.notCalled(onRejected);
        done();
      }, 50);
    });
  });
});
