"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _checkPrivateRedeclaration;
function _checkPrivateRedeclaration(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}