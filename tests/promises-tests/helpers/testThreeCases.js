(function (global) {
  'use strict';

  function pending() {
    var resolver;
    var promise = new Promise(function(r) {
      resolver = r;
    });

    return {
      promise: promise,
      fulfill: function (value) {
        resolver.resolve(value);
      },
      reject: function (value) {
        resolver.reject(value);
      }
    };
  }

  function testFulfilled(value, test) {
    specify('already-fulfilled', function (done) {
      test(Promise.fulfill(value), done);
    });

    specify('immediately-fulfilled', function (done) {
      var tuple = pending();
      test(tuple.promise, done);
      tuple.fulfill(value);
    });

    specify('eventually-fulfilled', function (done) {
      var tuple = pending();
      test(tuple.promise, done);
      setTimeout(function () {
        tuple.fulfill(value);
      }, 50);
    });
  }

  function testRejected(reason, test) {
    specify('already-rejected', function (done) {
      test(Promise.reject(reason), done);
    });

    specify('immediately-rejected', function (done) {
      var tuple = pending();
      test(tuple.promise, done);
      tuple.reject(reason);
    });

    specify('eventually-rejected', function (done) {
      var tuple = pending();
      test(tuple.promise, done);
      setTimeout(function () {
        tuple.reject(reason);
      }, 50);
    });
  }

  // CommonJS
  if (typeof exports === 'object') {
    module.exports.testFulfilled = testFulfilled;
    module.exports.testRejected = testRejected;

  // <script>
  } else {
    global.helper = {
      testFulfilled: testFulfilled,
      testRejected: testRejected
    };
  }
}(this.self));
