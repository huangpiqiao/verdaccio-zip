"use strict";

require("core-js/modules/es.object.define-property.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anyAwait = anyAwait;
exports.checkRoot = checkRoot;
exports.clearDir = clearDir;
exports.conso = void 0;
exports.getDay = getDay;
exports.getJson = getJson;
exports.prompts = void 0;
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.array.fill.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _promises = _interopRequireDefault(require("fs/promises"));
var _fs = require("fs");
var _dayjs = _interopRequireDefault(require("dayjs"));
var _chalk = _interopRequireDefault(require("chalk"));
var _logSymbols = _interopRequireDefault(require("log-symbols"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var conso = {
  warn: function warn(context) {
    console.log(_logSymbols["default"].warning, _chalk["default"].yellow(context));
  },
  error: function error(context) {
    console.log(_logSymbols["default"].error, _chalk["default"].red(context));
  },
  success: function success(context) {
    console.log(_logSymbols["default"].success, _chalk["default"].green(context));
  },
  info: function info(context) {
    console.log(_logSymbols["default"].info, _chalk["default"].black(context));
  }
};
exports.conso = conso;
function getJson(path) {
  var json = (0, _fs.readFileSync)(path, {
    encoding: "utf-8"
  });
  return JSON.parse(json);
}
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
  return new Array(days).fill("").map(function (item, idx) {
    return (0, _dayjs["default"])(new Date()).subtract(idx, "day").format("YYYY-MM-DD");
  });
}
function clearDir(target) {
  function clear(sourceDir) {
    return new Promise(function (resolve) {
      _promises["default"].stat(sourceDir).then(function (stat) {
        if (stat.isDirectory()) {
          _promises["default"].readdir(sourceDir).then(function (result) {
            var mapPms = result.map(function (file) {
              return clear("".concat(sourceDir, "/").concat(file));
            });
            Promise.all(mapPms).then(function () {
              // 不删除目标文件夹
              if (sourceDir === target) return resolve();
              _promises["default"].rmdir(sourceDir).then(function () {
                return resolve();
              });
            });
          });
        } else {
          _promises["default"].unlink(sourceDir).then(function () {
            return resolve();
          });
        }
      });
    });
  }
  return clear(target).then(function () {
    return true;
  });
}
var prompts = [{
  type: "list",
  name: "选择查找方式",
  choices: [{
    name: "根据verdaccio/storage目录内下载的最新的npm包查找",
    value: "walk"
  }, {
    name: "根据verdaccio/package项目内的package-lock.json查找",
    value: "map"
  }]
}, {
  type: "list",
  name: "选择时间",
  choices: getDay(12),
  when: function when(answer) {
    return answer["选择查找方式"] === "walk";
  }
}];
exports.prompts = prompts;