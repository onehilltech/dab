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
        concat.call (context, 'Hello, ', 'World') (callback);
      },

      function (data, callback) {
        expect (data).to.eql ('Hello, World');
        return callback (null);
      }
    ], done);
  });
});
