'use strict';

const async = require ('async')
  , genIds  = require ('./pass/generateIds')
  , resolve = require ('./pass/resolve')
  ;

function build (data, opts, callback) {
  const steps = [
    async.constant (data),
    genIds (opts),
    resolve (opts)
  ];

  async.waterfall (steps, callback);
}

module.exports = build;
