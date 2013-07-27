DOM Promises Polyfill
=============
[DOM Standard](http://dom.spec.whatwg.org/#promises) 2013-07-25 版の DOM Promises に可能な限り準拠した Polyfill

`then`メソッドに関する仕様は[Promises/A+](http://promisesaplus.com/) に準拠している

## イケてない点
`then`及び`catch`を`Promise.prototype`に公開できていない

## 使い方
* `<script>`タグで読み込む(グローバル変数 Promise を作成します)
* Node.js の module として使用

### 使用例:
```js
function fetchJSON(url) {
  return new Promise(function(resolver) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", url);
    xhr.onload = function () {
      if(xhr.response) {
        resolver.resolve(xhr.response);
      }
      resolver.reject(new DOMError("JSONError"));
    }
    xhr.onloadend = function () {
      resolver.reject(new DOMError("NetworkError"));
    }
    xhr.send()
  })
}

fetchJSON('/user/posts').then(
  function onFulfilled(response) {
    // Processing of success.
  },
  function onRejected(err) {
    // Processing of failure.
  }
);
```

## API リファレンス
[Reference.md](./Reference.md)

## テストの実行
* Node.js でテストするには`npm test`を実行する
* ブラウザでテストするには`tests/runner1.html`と`tests/runner1.html`をブラウザで開く

## 参考
* [slightlyoff/Promises](https://github.com/slightlyoff/Promises)

## ライセンス
Copyright 2013 [@8th713](https://github.com/8th713).

Licensed under the MIT License
