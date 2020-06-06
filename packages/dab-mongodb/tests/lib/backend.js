const dab = require ('@onehilltech/dab');
const backend = require ('../../lib');
const { expect } = require ('chai');
const { Types: { ObjectId }} = require ('mongoose');

describe ('lib | backend', function () {
  describe ('build', function () {
    it ('should build the models', function () {
      let data = {
        users: [
          {_id: dab.id (), first_name: 'Jane', last_name: 'Doe'}
        ],

        comments: [
          {user: dab.ref ('users.0'), comment: 'This is a simple comment'}
        ]
      };

      return dab.build (data, { backend }).then (result => {
        expect (result).to.have.nested.property ('users[0]._id').that.is.instanceof (ObjectId);

        expect (result.comments).to.have.length (1);
        expect (result).to.have.nested.property ('comments[0]._id').that.is.instanceof (ObjectId);
        expect (result).to.have.nested.property ('comments[0].user').that.eql (result.users[0]._id);
      });
    });
  });
});