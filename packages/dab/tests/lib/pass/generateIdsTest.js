const expect = require ('chai').expect
  , genIds   = require ('../../../lib/phase/generateIds')
  , async    = require ('async')
  , ObjectId = require ('mongoose').Types.ObjectId
  ;

describe ('lib.phase.generateIds', function () {
  it ('should generate ids for all entries in the data model', function (done) {
    var data = {
      persons: [
        {first_name: 'James', last_name: 'Hill'},
        {first_name: 'Lewis', last_name: 'Williams'}
      ]
    };

    async.waterfall ([
      async.constant (data),
      genIds ({id: '_id'}),

      function (data, callback) {
        async.every (data.persons, function (doc, callback) {
          expect (doc._id).to.be.instanceof (ObjectId);

          return callback (null);
        }, callback);
      }
    ], done);
  });
});
