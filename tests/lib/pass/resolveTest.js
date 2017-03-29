const expect = require ('chai').expect
  , resolve  = require ('../../../lib/phase/resolve')
  , async    = require ('async')
  , ObjectId = require ('mongoose').Types.ObjectId
  , dab      = require ('../../../lib')
  ;


describe ('lib.phase.resolve', function () {
  function computeEmail (value, opts, callback) {
    value.email = value.first_name.toLowerCase () + '.' + value.last_name.toLowerCase () + '@tester.com';
    return callback (null, value)
  }

  function computeComment (n, opts, callback) {
    const user = dab.ref (dab.sample (dab.get ('users')));
    const comment = 'This is comment number ' + (n + 1);

    return callback (null, {user: user, comment: comment});
  }

  it ('should resolve a scalar property', function (done) {
    var data = {
      users: [
        {_id: ObjectId (), first_name: 'Jane', last_name: 'Doe'},
        {_id: ObjectId (), first_name: 'John', last_name: 'Doe'}
      ],

      comments: [
        {_id: ObjectId (), user: dab.ref ('users.0'), comment: 'This is a simple comment'}
      ]
    };

    resolve ({id: '_id'}) (data, function (err, result, unresolved) {
      if (err)
        return done (err);

      expect (result).to.have.deep.property ('comments.0.user').to.eql (result.users[0]._id);
      expect (unresolved).to.equal (0);

      return done (null);
    });
  });

  it ('should resolve an array property', function (done) {
    var data = {
      users: [
        {_id: ObjectId (), first_name: 'Jane', last_name: 'Doe'},
        {_id: ObjectId (), first_name: 'John', last_name: 'Doe'}
      ],

      comments: dab.times (5, function (i, opts, callback) {
        return callback (null, {_id: ObjectId ()})
      })
    };

    resolve ({id: '_id'}) (data, function (err, result, unresolved) {
      if (err)
        return done (err);

      expect (result.comments).to.have.length (5);
      expect (unresolved).to.equal (0);

      return done (null);
    });
  });

  it ('should resolve a static value', function (done) {
    resolve ({id: '_id'}) ('static-value', function (err, result, unresolved) {
      if (err)
        return done (err);

      expect (result).to.equal ('static-value');
      expect (unresolved).to.equal (0);

      return done (null);
    });
  });

  it ('should resolve a top-level function composition', function (done) {
    var data = {
      users: [
        {_id: ObjectId (), first_name: 'Jane', last_name: 'Doe'},
        {_id: ObjectId (), first_name: 'John', last_name: 'Doe'}
      ],

      mapped: dab.map (
        dab.times (5, function (i, opts, callback) {
          return callback (null, {username: 'username' + i});
        }),
        function (value, opts, callback) {
          value.password = value.username;
          return callback (null, value);
        })
    };

    resolve ({id: '_id'}) (data, function (err, result, unresolved) {
      if (err)
        return done (err);

      expect (unresolved).to.equal (0);
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

    resolve ({id: '_id'}) (data, function (err, result, unresolved) {
      if (err)
        return done (err);

      expect (unresolved).to.equal (1);
      expect (result.mapped).to.be.a.function;
      expect (result.mapped.name).to.equal ('__dabMap');

      return done (null);
    });
  });

  it ('should have unresolved values because of nested resolvers', function (done) {
    var data = {
      users: dab.times (5, function (i, opts, callback) {
        return callback (null, {_id: new ObjectId (), username: 'username' + i})
      }),

      comments: dab.times (5, function (i, opts, callback) {
        var user = dab.ref (dab.sample (dab.get ('users')));
        var value = {user: user, comment: 'This is comment #' + i};

        return callback (null, value);
      })
    };

    resolve ({id: '_id'}) (data, function (err, result, unresolved) {
      if (err)
        return done (err);

      expect (unresolved).to.equal (5);
      expect (result.comments).to.have.length (5);

      for (var i = 0; i < 5; ++ i) {
        expect (result.comments[i].user).to.be.a.function;
        expect (result.comments[i].user.name).to.equal ('__dabRef');
      }

      return done (null);
    });
  });
});
