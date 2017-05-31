'use strict';

function concat () {
  var values = [].slice.call (arguments);

  return function __dabStringConcat (callback) {
    this.resolve (values, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, undefined);

      const str = String.prototype.concat.apply ('', result);
      return callback (null, str);
    });
  }.bind (this)
}

module.exports = concat;
