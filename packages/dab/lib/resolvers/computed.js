'use strict';

function computed (func) {
  return function __computed (callback) {
    func.call (this._data, this._opts, callback);
  }
}

module.exports = computed;
