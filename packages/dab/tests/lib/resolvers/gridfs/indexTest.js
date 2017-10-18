'use strict';

const expect = require ('chai').expect
  , mongoose = require ('mongoose')
  , async    = require ('async')
  , path     = require ('path')
  , gridfs   = require ('../../../../lib/resolvers/gridfs')
  ;

const file = path.resolve (__dirname, '../../../data/dab.jpg');


describe ('lib.resolvers.gridfs', function () {
  var conn = mongoose.createConnection ();

  before (function (done) {
    conn.openUri ('mongodb://localhost/dab_tests', done);
  });

  after (function (done) {
    conn.close (done);
  });

  it ('should add a file to GridFS', function (done) {
    var context = {
      resolve: function (values, callback) {
        return callback (null, values);
      }
    };

    async.waterfall ([
      function (callback) {
        gridfs.call (context, file, conn.db, 'images') (callback);
      },

      function (data, callback) {
        expect (data).to.be.instanceof (mongoose.Types.ObjectId);

        return callback (null);
      }
    ], done);
  });
});
