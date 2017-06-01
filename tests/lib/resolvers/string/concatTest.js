'use strict';

const expect = require ('chai').expect
  , async    = require ('async')
  , concat   = require ('../../../../lib/resolvers/string/concat')
;

describe ('lib.resolvers.string.concat', function () {
  it ('should concatenate a list of strings', function (done) {
    var context = {
      resolve: function (values, callback) {
        return callback (null, values);
      }
    };

    async.waterfall ([
      function (callback) {
        var resolver = concat.call (context, 'Hello, ', 'World');
        resolver.call (context, callback);
      },

      function (data, callback) {
        expect (data).to.eql ('Hello, World');
        return callback (null);
      }
    ], done);
  });
});
