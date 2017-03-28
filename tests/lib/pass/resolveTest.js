const expect = require ('chai').expect
  , resolve  = require ('../../../lib/pass/resolve')
  , async    = require ('async')
  , ObjectId = require ('mongoose').Types.ObjectId
  , dab      = require ('../../../lib')
  ;


describe ('lib.pass.resolve', function () {
  it ('should resolve all values', function (done) {

    function computeEmail (value, opts, callback) {
      value.email = value.first_name.toLowerCase () + '.' + value.last_name.toLowerCase () + '@tester.com';
      return callback (null, value)
    }

    function computeComment (n, opts, callback) {
      const user = dab.ref (dab.sample (dab.get ('users')));
      const comment = 'This is comment number ' + (n + 1);

      return callback (null, {user: user, comment: comment});
    }

    var data = {
      users: dab.map ([
        {_id: new ObjectId (), first_name: 'James', last_name: 'Hill'},
        {_id: new ObjectId (), first_name: 'Lewis', last_name: 'Williams'}
      ], computeEmail),

      friendships: [
        {_id: new ObjectId (), src: dab.ref ('users.0'), dst: dab.ref ('users.1')}
      ],

      organizations: dab.times (2, function (n, opts, callback) {
        return callback (null, {name: 'Organization' + n, owner: dab.ref ('users.0')});
      }),

      comments: dab.concat (
        dab.times (30, computeComment),
        dab.times (50, computeComment)
      ),

      shuffled: dab.shuffle (dab.get ('comments')),
      samples: dab.sample (dab.get ('comments'), 5),

      mapped: dab.map ([1, 2], function (value, opts, callback) {
        return callback (null, value * 2);
      }),

      mappedObj: dab.map ({first_name: 'John', last_name: 'Doe'}, function (value, key, opts, callback) {
        return callback (null, value.toLowerCase ());
      })
    };

    async.waterfall ([
      async.constant (data),
      resolve ({id: '_id'}),
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

        expect (data.comments).to.have.length (80);
        expect (data).to.have.deep.property ('comments.0.user').to.be.instanceof (ObjectId);
        expect (data).to.have.deep.property ('comments.0.comment', 'This is comment number 1');
        expect (data).to.have.deep.property ('comments.29.comment', 'This is comment number 30');

        expect (data).to.have.deep.property ('comments.30.user').to.be.instanceof (ObjectId);
        expect (data).to.have.deep.property ('comments.30.comment', 'This is comment number 1');
        expect (data).to.have.deep.property ('comments.79.comment', 'This is comment number 50');

        expect (data.samples).to.have.length (5);

        // test the map function
        expect (data.mapped).to.eql ([2, 4]);
        expect (data.mappedObj).to.eql ({first_name: 'john', last_name: 'doe'});

        return callback (null);
      }
    ], done);
  });
});
