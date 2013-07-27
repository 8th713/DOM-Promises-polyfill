(function (global) {
  'use strict';

  function pending() {
    var resolver;
    var promise = new Promise(function (r) {
      resolver = r;
    });

    return {
      promise: promise,
      resolver: resolver
    };
  }

  function fulfill(value) {
    return new Promise(function (resolver) {
      resolver.fulfill(value);
    });
  }

  function delayedFulfill(value, delay) {
    return new Promise(function (resolver) {
      setTimeout(function () {
        resolver.fulfill(value);
      }, delay);
    });
  }

  function reject(value) {
    return new Promise(function (resolver) {
      resolver.reject(value);
    });
  }

  function delayedReject(value, delay) {
    return new Promise(function (resolver) {
      setTimeout(function () {
        resolver.reject(value);
      }, delay);
    });
  }

  function callbackAggregator(times, ultimateCallback) {
    var soFar = 0;
    return function () {
      if (++soFar === times) {
        ultimateCallback();
      }
    };
  }

  // CommonJS
  if (typeof exports === 'object') {
    module.exports.pending = pending;
    module.exports.fulfill = fulfill;
    module.exports.reject = reject;
    module.exports.delayedFulfill = delayedFulfill;
    module.exports.delayedReject = delayedReject;
    module.exports.callbackAggregator = callbackAggregator;

  // <script>
  } else {
    global.utli = {
      pending: pending,
      fulfill: fulfill,
      reject: reject,
      delayedFulfill: delayedFulfill,
      delayedReject: delayedReject,
      callbackAggregator: callbackAggregator
    };
  }
}(this.self));
