const expect = require ('chai').expect
  , async    = require ('async')
  , build    = require ('../../lib/build')
  , dab      = require ('../../lib')
  ;

describe.skip ('lib.build', function () {
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

    return done ();
  })
});