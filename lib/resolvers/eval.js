const async = require ('async')
  , resolve = require ('../pass/resolve')
  ;

function eval (value, data, opts, callback) {
  process.nextTick (function () {
    async.waterfall ([
      async.constant (value),
      resolve (opts, data)
    ], callback);
  });
}

module.exports = eval;
