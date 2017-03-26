const expect  = require ('chai').expect
  , resolve   = require ('../../../lib/pass/resolve')
  , async     = require ('async')
  , ObjectId  = require ('mongoose').Types.ObjectId
  , dab = require ('../../../lib')
  ;


describe ('lib.pass.resolve', function () {
  function computeEmail (data, opts, callback) {
    var email = this.first_name.toLowerCase() + '.' + this.last_name.toLowerCase() + '@tester.com';
    return callback (null, email)
  }

  it ('should generate ids for all entries in the data model', function (done) {
    var data = {
      users: [
        {_id: new ObjectId (), first_name: 'James', last_name: 'Hill', email: dab.computed (computeEmail)},
        {_id: new ObjectId (), first_name: 'Lewis', last_name: 'Williams', email: dab.computed (computeEmail)}
      ],

      friendships: [
        {_id: new ObjectId (), src: dab.ref ('users.0'), dst: dab.ref ('users.1')}
      ],
      
      organizations: dab.times (2, function (data, opts, callback) {
        return callback (null, {name: 'Organization' + this.index, owner: dab.ref ('users.0')});
      })
    };

    async.waterfall ([
      async.constant (data),
      resolve ({id: '_id'}),

      function (data, callback) {
        expect (data.friendships[0].src).to.eql (data.users[0]._id);
        expect (data.friendships[0].dst).to.eql (data.users[1]._id);

        expect (data).to.have.deep.property ('users.0.email', 'james.hill@tester.com');
        expect (data).to.have.deep.property ('users.1.email', 'lewis.williams@tester.com');

        expect (data.organizations).to.have.length (2);
        expect (data).to.have.deep.property ('organizations.0.name', 'Organization0');
        expect (data).to.have.deep.property ('organizations.0.owner').to.eql (data.users[0]._id);

        expect (data).to.have.deep.property ('organizations.1.name', 'Organization1');
        expect (data).to.have.deep.property ('organizations.1.owner').to.eql (data.users[0]._id);

        return callback (null);
      }
    ], done);
  });
});
