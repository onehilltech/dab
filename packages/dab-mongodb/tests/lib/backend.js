const dab = require ('@onehilltech/dab');
const backend = require ('../../lib');
const { expect } = require ('chai');
const { Types: { ObjectId }} = require ('mongoose');
const faker = require ('faker');

describe ('lib | backend', function () {
  describe ('build', function () {
    it ('should build the models', function () {
      let data = {
        users: dab.times (2, () => ({_id: dab.id (), first_name: faker.name.firstName (), last_name: faker.name.lastName ()})),
        comments: dab.map (dab.get ('users'), user => ({_id: dab.id (), user: user._id, comment: faker.lorem.sentences () })),
        likes: dab.map (dab.get ('comments'), comment => ({_id: dab.id (), comment: comment._id }))
      };

      return dab.build (data, { backend }).then (result => {
        expect (result).to.have.nested.property ('users[0]._id').that.is.instanceof (ObjectId);

        expect (result.comments).to.have.length ();
        expect (result).to.have.nested.property ('comments[0]._id').that.is.instanceof (ObjectId);
        expect (result).to.have.nested.property ('comments[0].user').that.eql (result.users[0]._id);
      });
    });
  });
});