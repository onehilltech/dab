'use strict';

const expect = require ('chai').expect
  , async    = require ('async')
  , concat   = require ('../../../lib/resolvers/concat')
  ;

describe ('lib.resolvers.concat', function () {
  it ('should concatenate list of arrays', function (done) {
    var data = {};
    var opts = {};

    async.waterfall ([
      function (callback) {
        concat ([1, 2], [3, 4]).call (null, data, opts, callback);
      },

      function (data, callback) {
        expect (data).to.eql ([1, 2, 3, 4]);
        return callback (null);
      }
    ], done);
  });
});
