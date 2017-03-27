'use strict';

const async     = require ('async')
  , generateIds = require ('./pass/generateIds')
  , resolve     = require ('./pass/resolve')
  ;

function build (data, opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  const phases = [
    async.constant (data),
    resolve (opts),
    generateIds (opts),
    resolve (opts)
  ];

  async.waterfall (phases, callback);
}

module.exports = build;
