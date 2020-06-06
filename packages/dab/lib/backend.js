const { BaseObject } = require ('base-object');

module.exports = BaseObject.extend ({
  /// Human readable name for the backend.
  name: null,

  getPrimaryKeyForPath (path) {
    return 'id';
  },

  /**
   * Test of the connection for the backend supports the model name.
   */
  supports (conn, name) {

  },

  /**
   * Generate the id for a model.
   */
  generateId (value, path) {

  },

  /**
   * Seed the database with the set of models.
   *
   * @param conn
   * @param models
   */
  seed (conn, models) {

  },

  /**
   * Clear the collection of models.
   *
   * @param conn
   * @param models
   */
  clear (conn, models) {

  }
});
