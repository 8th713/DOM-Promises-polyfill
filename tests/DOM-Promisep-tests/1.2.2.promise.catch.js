describe('promise.catch(rejectCallback):', function () {
  'use strict';

  var isCommonJs = (typeof exports === 'object'),
      assert = isCommonJs ? require('assert') : chai.assert,
      sinon = isCommonJs ? require('sinon') : window.sinon,
      utli = isCommonJs ? require('./helpers/utli.js') : window.utli;

  var dummy = { dummy: 'dummy' };

  specify('`rejectCallback` is function. ' +
  'treated as undefined if not function type.', function () {
    var promise = utli.pending().promise;

    function test(value) {
      assert.doesNotThrow(function () {
        promise.catch(value);
      });
    }

    test(undefined);
    test(null);
    test(false);
    test(5);
    test({});
    test(function () {});
  });

  specify('Invoke `rejectCallback` with rejection reason ' +
  'if promise is rejected.', function (done) {
    var promise = utli.reject(dummy),
        spy = sinon.spy();

    promise.catch(spy);

    setTimeout(function () {
      sinon.assert.calledWith(spy, dummy);
      done();
    }, 30);
  });

  specify('`this` of `rejectCallback` is a promise object.', function (done) {
    var promise = utli.reject(dummy),
        spy = sinon.spy();

    promise.catch(spy);

    setTimeout(function () {
      sinon.assert.alwaysCalledOn(spy, promise);
      done();
    }, 30);
  });
});
