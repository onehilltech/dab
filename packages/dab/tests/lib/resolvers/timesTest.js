'use strict';

const expect = require ('chai').expect
  , async    = require ('async')
  , times    = require ('../../../lib/resolvers/times')
  ;

describe ('lib.resolvers.times', function () {
  it ('should generate 5 users', function (done) {
    var data = {};
    var opts = {};

    function computeEmail (data, opts, callback) {
      const email = 'tester' + this.index + '@no-reply.com';
      return callback (null, {email: email});
    }

    async.waterfall ([
      function (callback) {
        times (5, computeEmail).call (null, data, opts, callback);
      },

      function (data, callback) {
        expect (data).to.have.length (5);
        return callback (null);
      }
    ], done);
  });
});
