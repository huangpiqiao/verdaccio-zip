"use strict";

define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.anyAwait = anyAwait;
  function anyAwait(pms) {
    if (!pms || !pms.then) throw new Error("anyAwait:参数必须是promise");
    return pms.then(function (res) {
      return [null, res];
    })["catch"](function (err) {
      return [err, null];
    });
  }
});