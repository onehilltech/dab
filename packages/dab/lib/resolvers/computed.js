'use strict';

function computed (func) {
  return function __computed (data, opts, callback) {
    func (this, data, opts, callback);
  }
}

module.exports = computed;
