'use strict';

const _   = require ('underscore')
  , debug = require ('debug') ('dab:get')
  ;

function get (path) {
  return function __dabGet (callback) {
    var value = this._data.get (path);

    // If the result of get is a function, then that means the value has not
    // be resolved up to this point. We need to return undefined so the resolver
    // can include this this in the unresolved set.
    if (_.isFunction (value))
      value = undefined;

    callback (null, value);
  }
}

module.exports = get;
