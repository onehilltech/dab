'use strict';

const async = require ('async')
  , genIds  = require ('./pass/generateIds')
  , resolve = require ('./pass/resolve')
  ;

function build (data, opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  const steps = [
    async.constant (data),
    genIds (opts),
    resolve (opts)
  ];

  async.waterfall (steps, callback);
}

module.exports = build;
