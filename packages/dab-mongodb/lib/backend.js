const { Backend } = require ('@onehilltech/dab');

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
