'use strict';

const expect = require ('chai').expect
  , async    = require ('async')
  , concat   = require ('../../../lib/resolvers/concat')
  ;

describe ('lib.resolvers.concat', function () {
  it ('should concatenate list of arrays', function (done) {
    var context = {
      resolve: function (values, callback) {
        return callback (null, values);
      }
    };

    async.waterfall ([
      function (callback) {
        concat.call (context, [1, 2], [3, 4]).call (context, callback);
      },

      function (data, callback) {
        expect (data).to.eql ([1, 2, 3, 4]);
        return callback (null);
      }
    ], done);
  });
});
