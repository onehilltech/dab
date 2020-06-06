const dab = require ('@onehilltech/dab');
const { build, seed, clear } = require ('@onehilltech/dab');

const {
  Types: { ObjectId }
} = require ('mongoose');

module.exports = Backend.extend ({
  generateId (value) {
    return new ObjectId (value);
  },

  seed (conn, models) {

  }
});
