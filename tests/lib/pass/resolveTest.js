const expect = require ('chai').expect
  , resolve  = require ('../../../lib/phase/resolve')
  , async    = require ('async')
  , ObjectId = require ('mongoose').Types.ObjectId
  , dab      = require ('../../../lib')
  ;


describe ('lib.phase.resolve', function () {
  it ('should a property in an object', function (done) {
    var data = {
      users: [
        {_id: ObjectId (), first_name: 'Jane', last_name: 'Doe'},
        {_id: ObjectId (), first_name: 'John', last_name: 'Doe'}
      ],

      comments: [
        {_id: ObjectId (), user: dab.ref ('users.0'), comment: 'This is a simple comment'}
      ]
    };

    resolve (data, data, function (err, result, unresolved) {
      if (err)
        return done (err);

      expect (result).to.have.nested.property ('comments.0.user').to.eql (result.users[0]._id);
      expect (unresolved).to.eql ({});

      return done (null);
    });
  });

  it ('should resolve a function that generates an array', function (done) {
    var data = {
      users: [
        {_id: ObjectId (), first_name: 'Jane', last_name: 'Doe'},
        {_id: ObjectId (), first_name: 'John', last_name: 'Doe'}
      ],

      comments: dab.times (5, function (i, opts, callback) {
        return callback (null, {_id: ObjectId ()})
      })
    };

    resolve (data, data, function (err, result, unresolved) {
      if (err)
        return done (err);

      expect (result.comments).to.have.length (5);
      expect (unresolved).to.eql ({});

      return done (null);
    });
  });

  it ('should resolve a static value', function (done) {
    resolve ('static-value', {}, function (err, result, unresolved) {
      if (err)
        return done (err);

      expect (result).to.equal ('static-value');
      expect (unresolved).to.eql ({});

      return done (null);
    });
  });

  it ('should resolve function composition', function (done) {
    var data = {
      mapped: dab.map (
        dab.times (5, function (i, opts, callback) {
          return callback (null, {username: 'username' + i});
        }),
        function (value, opts, callback) {
          value.password = value.username;
          return callback (null, value);
        })
    };

    resolve (data, data, function (err, result, unresolved) {
      if (err)
        return done (err);

      expect (unresolved).to.eql ({});
      expect (result.mapped).to.have.length (5);

      for (var i = 0; i < 5; ++ i)
        expect (result.mapped[i].username).to.equal (result.mapped[i].password);

      return done (null);
    });
  });

  it ('should have unresolved values', function (done) {
    var data = {
      values: dab.times (5, function (i, opts, callback) {
        return callback (null, {value: i})
      }),

      mapped: dab.map (dab.get ('values'), function (item, opts, callback) {
        item.times3 = item.value * 3;
        return callback (null, item);
      })
    };

    resolve (data, data, function (err, result, unresolved) {
      if (err)
        return done (err);

      expect (unresolved).to.have.keys (['mapped']);
      expect (unresolved).to.have.nested.property ('mapped.name', '__dabMap');

      expect (result.mapped).to.be.undefined;

      return done (null);
    });
  });

  it ('should have unresolved values because of nested resolvers', function (done) {
    var data = {
      users: dab.times (2, function (i, opts, callback) {
        return callback (null, {_id: new ObjectId (), username: 'username' + i})
      }),

      comments: dab.times (2, function (i, opts, callback) {
        var user = dab.ref (dab.sample (dab.get ('users')));
        var value = {user: user, comment: 'This is comment #' + i};

        return callback (null, value);
      })
    };

    resolve (data, data, function (err, result, unresolved) {
      if (err)
        return done (err);

      expect (unresolved).to.have.keys (['comments.0.user', 'comments.1.user']);

      expect (result).to.have.nested.property ('comments.0.user').that.is.undefined;
      expect (result).to.have.nested.property ('comments.1.user').that.is.undefined;

      expect (result.comments).to.have.length (2);

      return done (null);
    });
  });
});
