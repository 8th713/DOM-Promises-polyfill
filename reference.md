DOM Promises Reference
=============

## 用語

### 解決
promise に紐付いた resolver の `fulfill`, `resolve`, `reject` のいずれかを実行する（した）

### 履行
promise に紐付いた resolver の `fulfill` を実行する（した）

### 棄却
promise に紐付いた resolver の `reject` を実行する（した）

### 解決値
promise が解決された時にコールバックが受け取る値

### Thenable オブジェクト
`then` メソッドを提供するオブジェクト。
必ずしも DOM Promise API が提供したものである必要はない。

## Promise
promise は結果が得られる時機が不定な処理の結果にアクセスするための、便利な手段を提供する。

### Construction
新しい promise インスタンスを作り promise に紐付いた resolver を第一引数にして init を実行する。

init が例外を派生させた場合その例外を理由に promise は棄却される。

```js
var promise = new Promise(init);
```

##### Parameters
* init - {Function} resolver オブジェクトを第一引数として実行されるべき関数

### Methods

#### Promise.fulfill(value)
value を解決値として履行された promise を返す。

##### Parameters
* value - {any} promise の解決値

##### Returns
* {promise} - 履行済みの promise

##### Example
```js
var value = 'foo';

var promise = Promise.fulfill(value);
promise.then(function(arg) {
  console.log(arg === value); // true
});
```

#### Promise.resolve(value)
引数 value が Thenable オブジェクトであった場合 value の状態と結果値に依存した promise を返す。

引数 value が Thenable オブジェクトではない場合このメソッドは`Promise.fulfill`と同じである。

##### Parameters
* value - {any} promise の解決値

##### Returns
* {promise} - `value`に依存した promise

##### Example
```js
var value = 'foo';
var promise1 = new Promise(function (resolver) {
  setTimeout(function () {
    resolver.fulfill(value);
  }, 500);
});

var promise2 = Promise.fulfill(promise1);
promise2.then(function (arg) { // promise1 履行前に実行される
  console.log(arg !== value);
  console.log(arg === promise1);
});

var promise3 = Promise.resolve(promise1);
promise3.then(function (arg) { // promise1 履行後に実行される
  console.log(arg === value);
  console.log(arg !== promise1);
});
```

#### Promise.reject(value)
value を解決値として棄却された promise を返す。

##### Parameters
* value - {any} promise の解決値

##### Returns
* {promise} - 棄却済みの promise

##### Example
```js
var value = 'foo';

var promise = Promise.reject(value);
promise.then(null, function(arg) {
  console.log(arg === value); // true
});
```

#### Promise.any(value1, ..., valueN)
引数の内最初に解決した promise の状態を引き継ぐ promise を返す。

この promise が解決された場合その解決値は引数の内最初に解決した promise の結果値となる。

##### Parameters
* value1, ..., valueN - {any} 並列処理したい promise
（Thenable オブジェクトでない場合は引数を解決値とした履行済み promise として扱われる）

##### Returns
* {promise} - 引数に依存した promise

##### Example
```js
var delayedPromise = function(delay, disposition, value) {
  return new Promise(function (resolver) {
    setTimeout(function(){
      resolver[disposition](value);
    }, delay);
  });
}

var value1 = {value: 1};
var value2 = {value: 2};

var anyPromise1 = Promise.any(
  delayedPromise(200, 'reject', value1),
  delayedPromise(100, 'fulfill', value2) // 一番最初に解決される promise
);

anyPromise1.then(function (arg) {
  console.log(arg === value2);
}, function () {
  // こちらは実行されない
});

var anyPromise2 = Promise.any(
  delayedPromise(200, 'fulfill', value1),
  delayedPromise(100, 'reject', value2) // 一番最初に解決される promise
);

anyPromise2.then(function () {
  // こちらは実行されない
}, function (arg) {
  console.log(arg === value2);
});
```

#### Promise.every(value1, ..., valueN)
引数全てが履行されたら履行され一つでも棄却されたら棄却される promise を返す。

この promise が履行された場合その解決値は引数の履行解決値を含む配列となる。

この promise が棄却された場合その解決値は引数の内最初に棄却された promise の解決値となる。

##### Parameters
* value1, ..., valueN - {any} 並列処理したいオブジェクト
（Thenable オブジェクトでない場合は引数を解決値とした履行済み promise として扱われる）

##### Returns
* {promise} - 新しい promise

##### Example
```js
var everyPromise1 = Promise.every(
  delayedPromise(100, 'fulfill', value1),
  delayedPromise(200, 'fulfill', value2),
);
everyPromise1.then(function (values) {
  console.log(values[0] === value1);
  console.log(values[1] === value2);
}, function () {
  // こちらは実行されない
});

var everyPromise2 = Promise.every(
  delayedPromise(100, 'reject', value1), // 棄却される promise
  delayedPromise(200, 'fulfill', value2),
);
everyPromise2.then(function () {
  // こちらは実行されない
}, function (reason) {
  console.log(reason === value2);
});
```

#### Promise.some(value1, ..., valueN)
引数全てが棄却されたら棄却され一つでも履行されたら履行される promise を返す。

この promise が棄却された場合その解決値は引数の棄却解決値を含む配列となる。

この promise が履行された場合その解決値は引数の内最初に履行された promise の解決値となる。

##### Parameters
* value1, ..., valueN - {any} 並列処理したいオブジェクト
（Thenable オブジェクトでない場合は引数を解決値とした履行済み promise として扱われる）

##### Returns
* {promise instance} - 新しい promise

##### Example
```js
var somePromise1 = Promise.every(
  delayedPromise(100, 'reject', value1),
  delayedPromise(200, 'reject', value2),
);
somePromise1.then(function () {
  // こちらは実行されない
}, function (values) {
  console.log(values[0] === value1);
  console.log(values[1] === value2);
});

var somePromise2 = Promise.every(
  delayedPromise(100, 'fulfill', value1), // 履行される promise
  delayedPromise(200, 'reject', value2),
);
somePromise2.then(function (value) {
  console.log(value === value1);
}, function () {
  // こちらは実行されない
});
```

### Instances Methods
インスタンスメソッドは本来`Promise.prototype`に公開されるべきだが本実装では`this`に直接定義している。

#### then([fulfillCallback [, rejectCallback]])
promise が解決した時に実行されるべき関数を登録し新しい promise を返す。

##### Parameters
* fulfillCallback(optional) - {any} promise が履行された時に実行される関数（関数以外なら無視）
* rejectCallback(optional) - {any} promise が棄却された時に実行される関数（関数以外なら無視）

##### Returns
* {promise} - fulfillCallback または rejectCallback の戻り値で履行される新しい promise

##### Example
```js
var value1 = 'value1';
var value2 = 'value2';

var promise1 = new Promise(function (resolver) {
  setTimeout(function () {
    resolver.resolve(value1);
  }, 100);
});

var promise2 = promise1.then(function (arg) {
  console.log(arg === value1);
  return value2;
});

promise2.then(function (arg) {
  console.log(arg === value2);
});
```

#### catch([rejectCallback])
`promise.then(null, rejectCallback)`と同義。

##### Parameters
* rejectCallback(optional) - {any} promise が棄却された時に実行される関数（関数以外なら無視）

##### Returns
* {promise} - rejectCallback の戻り値で履行される新しい promise

##### Example
```js
var value1 = 'value1';
var value2 = 'value2';

var promise1 = new Promise(function (resolver) {
  setTimeout(function () {
    resolver.reject(value1);
  }, 100);
});

var promise2 = promise1.catch(function (arg) {
  console.log(arg === value1);
  return value2;
});

promise2.then(function (arg) {
  console.log(arg === value2);
});
```

## PromiseResolver
紐付いた promise を解決するメソッドを提供する。

Promise をインスタンス化するときに渡された引数 init を呼び出すとき第一引数に渡される。

### Methods

#### resolver.fulfill(value)
引数で promise を履行する。

##### Parameters
* value - {any} promise の解決値

##### Example
```js
var value = 'foo';

var promise = new Promise(function (resolver) {
  setTimeout(function () {
    resolver.fulfill(value);
  }, 500);
});
promise.then(function (arg) {
  console.log(arg === value);
});
```

#### resolver.resolve(value)
引数の状態で promise を解決する。

引数 value が Thenable オブジェクトではない場合このメソッドは`resolver.fulfill`と同じである。

##### Parameters
* value - {any} promise の解決値

##### Example
```js
var value = 'foo';
var promise1 = new Promise(function (resolver) {  // 500ms 後に履行される promise
  setTimeout(function () {
    resolver.fulfill(value);
  }, 500);
});

var promise2 = new Promise(function (resolver) {
  resolver.fulfill(promise1);
});
promise2.then(function (arg) { // promise1 履行前に実行される
  console.log(arg !== value);
  console.log(arg === promise1);
});

var promise3 = new Promise(function (resolver) {
  resolver.resolve(promise1);
});
promise3.then(function (arg) { // promise1 履行後に実行される
  console.log(arg === value);
  console.log(arg !== promise1);
});
```

#### resolver.reject(value)
引数で promise を棄却する。

##### Parameters
* value - {any} promise の解決値

##### Example
```js
var value = 'foo';

var promise = new Promise(function (resolver) {
  setTimeout(function () {
    resolver.reject(value);
  }, 500);
});
promise.then(null, function (arg) {
  console.log(arg === value);
});
```
