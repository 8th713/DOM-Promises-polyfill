(function (global) {
  'use strict';

  var asyncCall = (function () {
    var ch, queue;

    if (typeof process !== 'undefined') {
      return function (callback) {
        var args = rest(arguments);

        process.nextTick(function () {
          callback.apply(null, args);
        });
      };
    }

    if (typeof setImmediate === 'function') {
      return function (callback) {
        var args = rest(arguments);

        window.setImmediate(callback, args);
      };
    }

    if (typeof MessageChannel === 'function') {
      ch = new MessageChannel();
      queue = [];

      ch.port1.onmessage = function () {
        var data;

        while (data = queue.shift()) {
          data.callback.apply(null, data.args);
        }
      };

      return function (callback) {
        queue.push({
          callback: callback,
          args: rest(arguments)
        });
        ch.port2.postMessage(0);
      };
    }

    return function (callback) {
      var args = rest(arguments);

      setTimeout(function () {
        callback.apply(null, args);
      }, 0);
    };
  }());

  function rest(args) {
    return Array.prototype.slice.call(args, 1);
  }

  function dequeueAll(list, value) {
    var callback;

    while (callback = list.shift()) {
      callback(value);
    }
  }

  function isFunction(any) {
    return typeof any === 'function';
  }

  function isThenable(any) {
    return any && any.then && isFunction(any.then);
  }

  function wrap(callback, resolver, promise, disp) {
    if (!isFunction(callback)) {
      return function (value) {
        resolver[disp](value);
      };
    }

    return function (value) {
      try {
        resolver.resolve(callback.call(promise, value));
      } catch(err) {
        resolver.reject(err);
      }
    };
  }

  function toPromiseList(list) {
    var result = [], i, l = list.length;

    for(i =0; i < l; i++) {
      result.push(Promise.resolve(list[i]));
    }
    return result;
  }



  function PromiseResolver(fulfilledCallbacks, rejectedCallbacks, setState, setResult) {
    var resolved = false;

    function fulfill(value) {
      setState('fulfilled');
      setResult(value);
      asyncCall(dequeueAll, fulfilledCallbacks, value);
    }

    function reject(value) {
      setState('rejected');
      setResult(value);
      asyncCall(dequeueAll, rejectedCallbacks, value);
    }

    function resolve(value) {
      if (isThenable(value)) {
        value.then(resolve, reject);
        return;
      }
      fulfill(value);
    }

    function ifNotResolved(func) {
      return function (value) {
        if (!resolved) {
          resolved = true;
          func(value);
        }
      };
    }

    this.fulfill = ifNotResolved(fulfill);
    this.resolve = ifNotResolved(resolve);
    this.reject = ifNotResolved(reject);
  }



  function Promise(init) {
    if (!init) {
      throw new TypeError('Not enough arguments');
    }
    if (!isFunction(init)) {
      throw new TypeError('Init argument must be a function');
    }

    var promise = this;
    var fulfilledCallbacks = [];
    var rejectedCallbacks = [];
    var state = 'pending';
    var result;

    promise.then = function (onFulfilled, onRejected) {
      return new Promise(function (resolver) {
        var fulfillWrapper = wrap(onFulfilled, resolver, promise, 'resolve');
        var rejectWrapper = wrap(onRejected, resolver, promise, 'reject');

        fulfilledCallbacks.push(fulfillWrapper);
        if (state == 'fulfilled') {
          asyncCall(dequeueAll, fulfilledCallbacks, result);
        }

        rejectedCallbacks.push(rejectWrapper);
        if (state == 'rejected') {
          asyncCall(dequeueAll, rejectedCallbacks, result);
        }
      });
    };

    promise.catch = function (onRejected) {
      return promise.then(null, onRejected);
    };

    var resolver = new PromiseResolver(
      fulfilledCallbacks, rejectedCallbacks,
      function (s) { state = s; },
      function (r) { result = r; }
    );

    try {
      init.call(promise, resolver);
    } catch (e) {
      resolver.reject(e);
    }
  }

  Promise.fulfill = function(value) {
    return new Promise(function(resolver) {
      resolver.fulfill(value);
    });
  };

  Promise.resolve = function(value) {
    return new Promise(function(resolver) {
      resolver.resolve(value);
    });
  };

  Promise.reject = function(reason) {
    return new Promise(function(resolver) {
      resolver.reject(reason);
    });
  };



  Promise.any = function() {
    var promises = toPromiseList(arguments);

    return new Promise(function(resolver) {
      if (!promises.length) {
        resolver.resolve();
        return;
      }

      var resolved = false;

      function firstResolve(value) {
        if (resolved) { return; }
        resolved = true;
        resolver.resolve(value);
      }

      function firstReject(reason) {
        if (resolved) { return; }
        resolved = true;
        resolver.reject(reason);
      }

      for (var i = 0, l = promises.length; i < l; i++) {
        promises[i].then(firstResolve, firstReject);
      }
    });
  };

  Promise.every = function() {
    var promises = toPromiseList(arguments);

    return new Promise(function(resolver) {
      var countdown = promises.length;

      if (!countdown) {
        resolver.resolve();
        return;
      }

      var values = new Array(countdown);

      function createfulfillCallback(index) {
        return function (value) {
          countdown -= 1;
          values[index] = value;
          if (!countdown) {
            resolver.resolve(values);
          }
        };
      }

      for (var i = 0; i < countdown; i++) {
        promises[i].then(createfulfillCallback(i), resolver.reject);
      }
    });
  };

  Promise.some = function() {
    var promises = toPromiseList(arguments);

    return new Promise(function(resolver) {
      var countdown = promises.length;

      if (!promises.length) {
        resolver.resolve();
        return;
      }

      var values = new Array(countdown);

      function createRejectCallback(index) {
        return function (arg) {
          countdown -= 1;
          values[index] = arg;
          if (!countdown) {
            resolver.reject(values);
          }
        };
      }

      for (var i =0, l = promises.length; i < l; i++) {
        promises[i].then(resolver.resolve, createRejectCallback(i));
      }
    });
  };

  // CommonJS
  if (typeof exports === 'object') {
    module.exports = Promise;

  // <script>
  } else if (global.Promise === void 0) {
    global.Promise = Promise;
  }
}(this.self));
