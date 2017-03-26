const expect  = require ('chai').expect
  , resolve   = require ('../../../lib/pass/resolve')
  , async     = require ('async')
  , ObjectId  = require ('mongoose').Types.ObjectId
  , datamodel = require ('../../../lib')
  ;


describe ('lib.pass.resolve', function () {
  function computeEmail (data, opts, callback) {
    var email = this.first_name.toLowerCase() + '.' + this.last_name.toLowerCase() + '@tester.com';
    return callback (null, email)
  }

  it ('should generate ids for all entries in the data model', function (done) {
    var data = {
      users: [
        {_id: new ObjectId (), first_name: 'James', last_name: 'Hill', email: datamodel.computed (computeEmail)},
        {_id: new ObjectId (), first_name: 'Lewis', last_name: 'Williams', email: datamodel.computed (computeEmail)}
      ],

      friendships: [
        {_id: new ObjectId (), src: datamodel.ref ('users.0'), dst: datamodel.ref ('users.1')}
      ]
    };

    async.waterfall ([
      async.constant (data),
      resolve ({id: '_id'}),

      function (data, callback) {
        expect (data.friendships[0].src).to.eql (data.users[0]._id);
        expect (data.friendships[0].dst).to.eql (data.users[1]._id);

        expect (data.users[0].email).to.equal ('james.hill@tester.com');
        expect (data.users[1].email).to.equal ('lewis.williams@tester.com');

        return callback (null);
      }
    ], done);
  });
});
