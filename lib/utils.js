"use strict";

require("core-js/modules/es.object.define-property.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anyAwait = anyAwait;
exports.checkRoot = checkRoot;
exports.getDay = getDay;
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.array.fill.js");
require("core-js/modules/es.date.to-string.js");
var _dayjs = _interopRequireDefault(require("dayjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function anyAwait(pms) {
  if (!pms || !pms.then) throw new Error("anyAwait:参数必须是promise");
  return pms.then(function (res) {
    return [null, res];
  })["catch"](function (err) {
    return [err, null];
  });
}
function checkRoot() {
  var p = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return !!p && p !== "/";
}
function getDay() {
  var days = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 7;
  return new Array(days).fill('').map(function (item, idx) {
    return (0, _dayjs["default"])(new Date()).subtract(idx, 'day').format('YYYY-MM-DD');
  });
}