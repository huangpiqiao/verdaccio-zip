"use strict";

require("core-js/modules/es.array.join.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.regexp.test.js");
require("core-js/modules/es.symbol.async-iterator.js");
require("core-js/modules/es.symbol.to-string-tag.js");
require("core-js/modules/es.json.to-string-tag.js");
require("core-js/modules/es.math.to-string-tag.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.object.set-prototype-of.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pack2Zip = void 0;
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.number.constructor.js");
var _promises = _interopRequireDefault(require("fs/promises"));
var _fs = require("fs");
var _path = require("path");
var _replace = _interopRequireDefault(require("lodash/replace"));
var _ora = _interopRequireDefault(require("ora"));
var _admZip = _interopRequireDefault(require("adm-zip"));
var _utils = require("./utils.js");
var _download = _interopRequireDefault(require("download"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Pack2Zip = /*#__PURE__*/function () {
  function Pack2Zip(_ref) {
    var sourceDir = _ref.sourceDir,
      destDir = _ref.destDir,
      zipPath = _ref.zipPath,
      packages = _ref.packages,
      selectedDate = _ref.selectedDate,
      replace = _ref.replace;
    _classCallCheck(this, Pack2Zip);
    this.sourceDir = sourceDir;
    this.destDir = destDir;
    this.zipPath = zipPath;
    this.packages = packages;
    this.replace = replace;
    this.selectedDate = new Date(selectedDate).getTime();
    // this.finish = debounce(this.startCompress, 1000);
    this.spinner = (0, _ora.default)("\u6B63\u5728\u590D\u5236\u6587\u4EF6\u81F3 ".concat(destDir, " \n"));
  }
  _createClass(Pack2Zip, [{
    key: "start",
    value: function () {
      var _start = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var type,
          sourceDir,
          destDir,
          spinner,
          _yield$anyAwait,
          _yield$anyAwait2,
          err,
          _args = arguments;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              type = _args.length > 0 && _args[0] !== undefined ? _args[0] : "walk";
              sourceDir = this.sourceDir, destDir = this.destDir, spinner = this.spinner;
              spinner.clear();
              _context.next = 5;
              return (0, _utils.anyAwait)((0, _utils.clearDir)(destDir));
            case 5:
              _yield$anyAwait = _context.sent;
              _yield$anyAwait2 = _slicedToArray(_yield$anyAwait, 1);
              err = _yield$anyAwait2[0];
              if (!err) {
                _context.next = 12;
                break;
              }
              spinner.stop();
              _utils.conso.error("\u590D\u5236\u9519\u8BEF:".concat(err));
              return _context.abrupt("return");
            case 12:
              this.spinner.start();
              if (!(type === "walk")) {
                _context.next = 18;
                break;
              }
              _context.next = 16;
              return this.walk(sourceDir);
            case 16:
              _context.next = 20;
              break;
            case 18:
              _context.next = 20;
              return this.map();
            case 20:
              this.spinner.stop();
              _utils.conso.success("\u590D\u5236\u6587\u4EF6\u5B8C\u6210");
              this.startCompress();
            case 23:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function start() {
        return _start.apply(this, arguments);
      }
      return start;
    }() // node 16以上版本使用
  }, {
    key: "map",
    value: function () {
      var _map = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var sourceDir, packages, _iterator, _step, item, packageDir, itemName, packagePath, packageJsonPath;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              sourceDir = this.sourceDir, packages = this.packages;
              _iterator = _createForOfIteratorHelper(packages);
              _context2.prev = 2;
              _iterator.s();
            case 4:
              if ((_step = _iterator.n()).done) {
                _context2.next = 16;
                break;
              }
              item = _step.value;
              packageDir = (0, _path.join)(sourceDir, item.packPath);
              itemName = "".concat(item.packName, "-").concat(item.version, ".tgz");
              packagePath = (0, _path.join)(packageDir, itemName);
              packageJsonPath = (0, _path.join)(sourceDir, 'data', item.packPath);
              _context2.next = 12;
              return this.shouildDownloadFile(item.remoteUrl, packagePath, packageDir);
            case 12:
              _context2.next = 14;
              return this.copy(packagePath, packageJsonPath, itemName);
            case 14:
              _context2.next = 4;
              break;
            case 16:
              _context2.next = 21;
              break;
            case 18:
              _context2.prev = 18;
              _context2.t0 = _context2["catch"](2);
              _iterator.e(_context2.t0);
            case 21:
              _context2.prev = 21;
              _iterator.f();
              return _context2.finish(21);
            case 24:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[2, 18, 21, 24]]);
      }));
      function map() {
        return _map.apply(this, arguments);
      }
      return map;
    }()
  }, {
    key: "walk",
    value: function () {
      var _walk = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(sourceDir) {
        var _yield$anyAwait3, _yield$anyAwait4, err, result, _iterator2, _step2, itemName, itemPath, _yield$sourceInfo, isDirectory, mtms;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _utils.anyAwait)(_promises.default.readdir(sourceDir));
            case 2:
              _yield$anyAwait3 = _context3.sent;
              _yield$anyAwait4 = _slicedToArray(_yield$anyAwait3, 2);
              err = _yield$anyAwait4[0];
              result = _yield$anyAwait4[1];
              if (!err) {
                _context3.next = 8;
                break;
              }
              throw new Error(err);
            case 8:
              _iterator2 = _createForOfIteratorHelper(result);
              _context3.prev = 9;
              _iterator2.s();
            case 11:
              if ((_step2 = _iterator2.n()).done) {
                _context3.next = 31;
                break;
              }
              itemName = _step2.value;
              itemPath = "".concat(sourceDir, "/data/").concat(itemName);
              _context3.next = 16;
              return (0, _utils.sourceInfo)(itemPath);
            case 16:
              _yield$sourceInfo = _context3.sent;
              isDirectory = _yield$sourceInfo.isDirectory;
              mtms = _yield$sourceInfo.mtms;
              if (!isDirectory) {
                _context3.next = 23;
                break;
              }
              _context3.next = 22;
              return this.walk(itemPath);
            case 22:
              return _context3.abrupt("continue", 29);
            case 23:
              if (!(0, _utils.isNotTgz)(itemPath)) {
                _context3.next = 25;
                break;
              }
              return _context3.abrupt("continue", 29);
            case 25:
              if (!(0, _utils.isOldFile)(mtms, this.selectedDate)) {
                _context3.next = 27;
                break;
              }
              return _context3.abrupt("continue", 29);
            case 27:
              _context3.next = 29;
              return this.copy(itemPath, sourceDir, itemName);
            case 29:
              _context3.next = 11;
              break;
            case 31:
              _context3.next = 36;
              break;
            case 33:
              _context3.prev = 33;
              _context3.t0 = _context3["catch"](9);
              _iterator2.e(_context3.t0);
            case 36:
              _context3.prev = 36;
              _iterator2.f();
              return _context3.finish(36);
            case 39:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[9, 33, 36, 39]]);
      }));
      function walk(_x2) {
        return _walk.apply(this, arguments);
      }
      return walk;
    }()
  }, {
    key: "copy",
    value: function () {
      var _copy = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(sourcePath, sourceDir, sourceName) {
        var destPath, destDir, packJsonFrom;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              destPath = (0, _replace.default)(sourcePath, this.sourceDir, this.destDir);
              destDir = (0, _replace.default)(destPath, sourceName, "");
              (0, _utils.createDestChildsDir)(destDir, this.destDir);
              packJsonFrom = function packJsonFrom(dp) {
                return (0, _path.join)(dp, 'package.json');
              };
              _utils.conso.warn("\u5F53\u524D\u590D\u5236 ".concat(sourcePath, " => ").concat(destPath));
              _context4.next = 7;
              return _promises.default.copyFile(sourcePath, destPath).then(function () {
                _utils.conso.success("\u590D\u5236\u6210\u529F");
              }).catch(function () {
                _utils.conso.error("\u590D\u5236\u5931\u8D25");
              });
            case 7:
              if (!this.replace) {
                _context4.next = 11;
                break;
              }
              _utils.conso.warn("\u5F53\u524D\u590D\u5236 ".concat(packJsonFrom(sourceDir), " => ").concat(packJsonFrom(destDir)));
              _context4.next = 11;
              return _promises.default.copyFile(packJsonFrom(sourceDir), packJsonFrom(destDir)).then(function () {
                _utils.conso.success("\u590D\u5236\u6210\u529F");
              }).catch(function () {
                _utils.conso.error("\u590D\u5236\u5931\u8D25");
              });
            case 11:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function copy(_x3, _x4, _x5) {
        return _copy.apply(this, arguments);
      }
      return copy;
    }()
  }, {
    key: "shouildDownloadFile",
    value: function shouildDownloadFile(remoteUrl, packagePath, packageDir) {
      return new Promise(function (resolve) {
        console.log(packagePath, 'packagePath');
        if (!(0, _fs.existsSync)(packagePath) && remoteUrl) {
          // this.finish = null;
          _utils.conso.warn("\u6B63\u5728\u4E0B\u8F7D ".concat(remoteUrl));
          (0, _download.default)(remoteUrl, packageDir).then(function () {
            _utils.conso.success("\u4E0B\u8F7D\u5B8C\u6210 ".concat(remoteUrl));
            // this.finish = debounce(this.startCompress, 1000);
            resolve();
          });
          return;
        }
        resolve();
      });
    }
  }, {
    key: "startCompress",
    value: function startCompress() {
      this.spinner = (0, _ora.default)("正在压缩文件\n");
      this.spinner.start();
      this.compress();
    }
  }, {
    key: "compress",
    value: function compress() {
      var admzip = new _admZip.default();
      admzip.addLocalFolder(this.destDir);
      admzip.writeZip(this.zipPath);
      this.spinner.stop();
      _utils.conso.success("\u538B\u7F29\u6587\u4EF6\u5B8C\u6210");
    }
  }]);
  return Pack2Zip;
}();
exports.Pack2Zip = Pack2Zip;