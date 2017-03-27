const async = require ('async')
  , resolve = require ('../pass/resolve')
  ;

function resolver (value, data, opts, then, callback) {
  async.waterfall ([
    async.constant (value),
    resolve (opts, data),
    then], callback);
}

module.exports = resolver;
