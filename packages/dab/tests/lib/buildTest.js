const expect = require ('chai').expect
  , mongoose = require ('mongoose')
  , async    = require ('async')
  , ObjectId = mongoose.Types.ObjectId
  , build    = require ('../../lib/build')
  , dab      = require ('../../lib')
  ;

describe ('lib.build', function () {
  it ('should generate on objects (before)', function (done) {
    let data = {
      users: [
        {_id: dab.id (), first_name: 'Jane', last_name: 'Doe'}
      ],

      comments: [
        {user: dab.ref ('users.0'), comment: 'This is a simple comment'}
      ]
    };

    build (data, function (err, result) {
      if (err)
        return done (err);

      expect (result).to.have.nested.property ('users[0]._id').that.is.instanceof (ObjectId);

      expect (result.comments).to.have.length (1);
      expect (result).to.have.nested.property ('comments[0]._id').that.is.instanceof (ObjectId);
      expect (result).to.have.nested.property ('comments[0].user').that.eql (result.users[0]._id);

      return done (null);
    });
  });

  it ('should generate on objects (after)', function (done) {
    let data = {
      comments: [
        {user: dab.ref ('users.0'), comment: 'This is a simple comment'}
      ],

      users: [
        {first_name: 'Jane', last_name: 'Doe'}
      ]
    };

    build (data, function (err, result) {
      if (err)
        return done (err);

      expect (result).to.have.nested.property ('users[0]._id').that.is.instanceof (ObjectId);

      expect (result.comments).to.have.length (1);
      expect (result).to.have.nested.property ('comments[0]._id').that.is.instanceof (ObjectId);
      expect (result).to.have.nested.property ('comments[0].user').that.eql (result.users[0]._id);

      return done (null);
    });
  });

  it ('should build a model with composed resolvers', function (done) {
    let data = {
      mapped: dab.map (
        dab.times (5, function (i, opts, callback) {
          return callback (null, {username: 'username' + i});
        }),
        function (value, opts, callback) {
          value.password = value.username;
          return callback (null, value);
        })
    };

    build (data, function (err, result) {
      if (err)
        return done (err);

      expect (result.mapped).to.have.length (5);

      for (let i = 0; i < 5; ++ i)
        expect (result).to.have.nested.property ('mapped[' + i + '].username').that.equals ('username' + i);

      return done (null);
    });
  });

  it ('should build a model with embedded resolvers', function (done) {
    let data = {
      users: [
        {first_name: 'Jane', last_name: 'Doe'},
        {first_name: 'John', last_name: 'Doe'}
      ],

      comments: dab.times (5, function (i, opts, callback) {
        let user = dab.ref (dab.sample (dab.get ('users')));
        let comment = {user: user, comment: 'This is comment ' + i};
        return callback (null, comment);
      })
    };

    build (data, function (err, result) {
      if (err)
        return done (err);

      // check the users
      expect (result).to.have.nested.property ('users[0]._id').that.is.instanceof (ObjectId);
      expect (result).to.have.nested.property ('users[1]._id').that.is.instanceof (ObjectId);

      // check the comments
      expect (result.comments).to.have.length (5);

      async.each (result.comments, function (item, callback) {
        expect (item).to.have.deep.property ('user').that.is.instanceof (ObjectId);

        async.some (result.users, function (user, callback) {
          return callback (null, user._id.equals (item.user));
        }, callback);
      }, done);
    });
  });

  it ('should build a model with unresolved values', function (done) {
    let data = {
      users: dab.times (2, function (i, opts, callback) {
        return callback (null, {name: 'User' + i});
      }),

      comments: dab.times (5, function (i, opts, callback) {
        let user = dab.ref (dab.sample (dab.get ('users')));
        let comment = {user: user, comment: 'This is comment ' + i};
        return callback (null, comment);
      })
    };

    build (data, function (err, result) {
      if (err)
        return done (err);

      // check the users
      expect (result.users).to.have.length (2);

      for (let i = 0, stop = result.users.length; i < stop; ++ i) {
        expect (result).to.have.nested.property ('users[' + i + ']._id').that.is.instanceof (ObjectId);
        expect (result).to.have.nested.property ('users[' + i + '].name', 'User' + i);
      }

      // check the comments
      expect (result.comments).to.have.length (5);

      async.each (result.comments, function (item, callback) {
        expect (item).to.have.deep.property ('user').that.is.instanceof (ObjectId);

        async.some (result.users, function (user, callback) {
          return callback (null, user._id.equals (item.user));
        }, callback);
      }, done);
    });
  });
});