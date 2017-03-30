'use strict';

const expect = require ('chai').expect
  , async    = require ('async')
  , filter   = require ('../../../lib/resolvers/filter')
  ;

describe ('lib.resolvers.filter', function () {
  it ('should filter values from the data', function (done) {
    var data = [1, 2, 3, 5, 6];

    var context = {
      resolve: function (values, callback) {
        return callback (null, values);
      }
    };

    async.waterfall ([
      function (callback) {
        filter.call (context, data, function (value, opts, callback) {
          return callback (null, value !== 1);
        }) (callback);
      },

      function (data, callback) {
        expect (data).to.eql ([2, 3, 5, 6]);
        return callback (null);
      }
    ], done);
  });
});
