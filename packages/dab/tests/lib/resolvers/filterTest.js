'use strict';

const expect = require ('chai').expect
  , async    = require ('async')
  , filter   = require ('../../../lib/resolvers/filter')
  ;

describe ('lib.resolvers.filter', function () {
  it ('should filter values from the data', function (done) {
    var data = [1, 2, 3, 5, 6];
    var opts = {};

    async.waterfall ([
      function (callback) {
        filter (data, function (value, data, opts, callback) {
          return callback (null, value !== 1);
        }).call (null, data, opts, callback);
      },

      function (data, callback) {
        expect (data).to.eql ([2, 3, 5, 6]);
        return callback (null);
      }
    ], done);
  });
});
