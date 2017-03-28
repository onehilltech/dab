const expect = require ('chai').expect
  , async    = require ('async')
  , build    = require ('../../lib/build')
  , dab      = require ('../../lib')
  ;

describe ('lib.build', function () {
  it ('should build a data model', function (done) {
    function computeEmail (value, opts, callback) {
      const email = value.first_name.toLowerCase () + '.' + value.last_name.toLowerCase () + '@tester.com';
      return callback (null, email);
    }

    function computeComment (i, opts, callback) {
      const user = dab.ref (dab.sample (this.get ('users')));
      const comment = 'This is comment number ' + (i + 1);

      return callback (null, {user: user, comment: comment});
    }

    function filterComment (value, opts, callback) {
      return callback (null, value.comment !== 'This is comment number 1');
    }

    var data = {
      users: dab.map ([
        {first_name: 'James', last_name: 'Hill'},
        {first_name: 'Lewis', last_name: 'Williams'}
      ], computeEmail),

      friendships: [
        {src: dab.ref ('users.0'), dst: dab.ref ('users.1')}
      ],

      organizations: dab.times (2, function (data, opts, callback) {
        return callback (null, {name: 'Organization' + this.index, owner: dab.ref ('users.0')});
      }),

      comments: dab.filter (dab.concat (
        dab.times (30, computeComment),
        dab.times (50, computeComment)
      ), filterComment),

      shuffled: dab.shuffle (dab.get ('comments')),
      samples: dab.sample (dab.get ('comments'), 5)
    };

    async.waterfall ([
      function (callback) {
        build (data, callback);
      },

      function (result, callback) {
        expect (result.friendships[0].src).to.eql (result.users[0]._id);
        expect (result.friendships[0].dst).to.eql (result.users[1]._id);

        expect (result).to.have.deep.property ('users.0.email', 'james.hill@tester.com');
        expect (result).to.have.deep.property ('users.1.email', 'lewis.williams@tester.com');

        expect (result.organizations).to.have.length (2);
        expect (result).to.have.deep.property ('organizations.0.name', 'Organization0');
        expect (result).to.have.deep.property ('organizations.0.owner').to.eql (result.users[0]._id);

        expect (result).to.have.deep.property ('organizations.1.name', 'Organization1');
        expect (result).to.have.deep.property ('organizations.1.owner').to.eql (result.users[0]._id);

        expect (result.comments).to.have.length (78);
        expect (result).to.have.deep.property ('comments.0.user').to.eql (result.users[0]._id);
        expect (result).to.have.deep.property ('comments.0.comment', 'This is comment number 2');
        expect (result).to.have.deep.property ('comments.28.comment', 'This is comment number 30');

        expect (result).to.have.deep.property ('comments.29.user').to.eql (result.users[1]._id);
        expect (result).to.have.deep.property ('comments.29.comment', 'This is comment number 2');
        expect (result).to.have.deep.property ('comments.77.comment', 'This is comment number 50');

        expect (result.samples).to.have.length (5);

        return callback (null);
      }
    ], done);
  });
});