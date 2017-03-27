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

    function computeComment (user) {
      var i = user;

      return function __computeComment (data, opts, callback) {
        const user = data.get ('users.' + i + '._id');
        const comment = 'This is comment number ' + (this.index + 1);

        return callback (null, {user: user, comment: comment});
      }
    }

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
      }),

      comments: dab.filter (dab.concat (
        dab.times (30, computeComment (0)),
        dab.times (50, computeComment (1))
      ), function (value, data, opts, callback) {
        return callback (null, value.comment !== 'This is comment number 1');
      }),

      shuffled: dab.shuffle (dab.get ('comments')),
      samples: dab.sample (dab.get ('comments'), 5)
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

        expect (data.comments).to.have.length (78);
        expect (data).to.have.deep.property ('comments.0.user').to.eql (data.users[0]._id);
        expect (data).to.have.deep.property ('comments.0.comment', 'This is comment number 2');
        expect (data).to.have.deep.property ('comments.28.comment', 'This is comment number 30');

        expect (data).to.have.deep.property ('comments.29.user').to.eql (data.users[1]._id);
        expect (data).to.have.deep.property ('comments.29.comment', 'This is comment number 2');
        expect (data).to.have.deep.property ('comments.77.comment', 'This is comment number 50');

        expect (data.samples).to.have.length (5);

        return callback (null);
      }
    ], done);
  });
});
