'use strict';

const expect = require ('chai').expect
  , async    = require ('async')
  , times    = require ('../../../lib/resolvers/times')
  ;

describe ('lib.resolvers.times', function () {
  it ('should generate 5 users', function (done) {
    let context = {
      resolve: function (values, callback) {
        return callback (null, values);
      }
    };

    function computeEmail (i, opts, callback) {
      const email = 'tester' + i + '@no-reply.com';
      return callback (null, {email: email});
    }

    async.waterfall ([
      function (callback) {
        times.call (context, 5, computeEmail).call (context, callback);
      },

      function (data, callback) {
        expect (data).to.have.length (5);

        for (var i = 0; i < data.length; ++ i)
          expect (data[i]).to.have.property ('email', 'tester' + i + '@no-reply.com');

        return callback (null);
      }
    ], done);
  });
});
